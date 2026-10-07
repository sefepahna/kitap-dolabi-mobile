// Wires the pure rental-flow reducer to the existing mock services and the shared demo store.
// Availability is always derived from the store; the rental is created only through rentalService.

import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { BackHandler } from "react-native";

import { DEFAULT_LOCKER_ID } from "../data/mock";
import { getActiveRentals, useDemoState } from "../lib/demo-store";
import { authService, lockerService, paymentService, rentalService } from "../lib/mock-services";
import {
  FLOW_FAILURE_ERROR,
  PHONE_ERROR,
  VERIFIED_DISPLAY_MS,
  initialRentalFlowState,
  isCompleteOtp,
  isPrePaymentStep,
  isValidPhone,
  normalizeOtpInput,
  rentalFlowReducer,
  resolveRentalEligibility,
} from "../lib/rental-flow";

const RENTALS_HREF: Href = "/(locker)/rentals";
const BOOKS_HREF: Href = "/(locker)/books";
const LOCKER_HREF: Href = "/(locker)";
const RFID_FAILURE_ERROR = "Kitap doğrulanamadı. Lütfen görevliye başvur.";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function useRentalFlow() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const demoState = useDemoState();
  const [flow, dispatch] = useReducer(rentalFlowReducer, initialRentalFlowState);
  const [busy, setBusy] = useState(false);
  const lockRef = useRef(false);
  const mountedRef = useRef(true);

  const eligibility = resolveRentalEligibility(
    typeof bookId === "string" ? bookId : undefined,
    DEFAULT_LOCKER_ID,
    demoState,
  );
  const book = eligibility.status === "missing" ? undefined : eligibility.book;
  const createdRental = book
    ? getActiveRentals(demoState).find((rental) => rental.copyId === book.copyId)
    : undefined;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /** Runs one async action at a time; repeated taps while it runs are ignored. */
  const runExclusive = useCallback(async (task: () => Promise<void>, onError: (error: unknown) => void) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setBusy(true);
    try {
      await task();
    } catch (error) {
      console.error("[rental-flow]", error);
      if (mountedRef.current) onError(error);
    } finally {
      lockRef.current = false;
      if (mountedRef.current) setBusy(false);
    }
  }, []);

  const exitTo = useCallback(
    (href: Href) => {
      if (router.canDismiss()) router.dismissAll();
      router.replace(href);
    },
    [router],
  );

  const changePhone = (value: string) => {
    if (!lockRef.current) dispatch({ type: "phoneChanged", value });
  };

  const submitPhone = () =>
    runExclusive(
      async () => {
        if (!isValidPhone(flow.phone)) {
          dispatch({ type: "validationFailed", message: PHONE_ERROR });
          return;
        }
        await authService.sendOtp(flow.phone);
        if (mountedRef.current) dispatch({ type: "otpRequested" });
      },
      () => dispatch({ type: "validationFailed", message: FLOW_FAILURE_ERROR }),
    );

  const submitOtp = (code: string = flow.otp) =>
    runExclusive(
      async () => {
        if (!isCompleteOtp(code)) return;
        const verified = await authService.verifyOtp(code);
        if (mountedRef.current) dispatch({ type: verified ? "otpVerified" : "otpRejected" });
      },
      () => dispatch({ type: "validationFailed", message: FLOW_FAILURE_ERROR }),
    );

  const changeOtp = (value: string) => {
    if (lockRef.current) return;
    dispatch({ type: "otpChanged", value });
    const code = normalizeOtpInput(value);
    if (isCompleteOtp(code)) void submitOtp(code);
  };

  /** summary → paying → preparing → opened */
  const confirmPayment = () =>
    runExclusive(
      async () => {
        if (flow.step !== "summary" || eligibility.status !== "ready") return;
        dispatch({ type: "paymentStarted" });

        try {
          await paymentService.processPayment(eligibility.book.fee);
        } catch (error) {
          console.error("[rental-flow] payment", error);
          dispatch({ type: "paymentFailed", message: FLOW_FAILURE_ERROR });
          return;
        }
        if (!mountedRef.current) return;
        dispatch({ type: "paymentSucceeded" });

        await lockerService.openCompartment(DEFAULT_LOCKER_ID, eligibility.book.slot);
        if (mountedRef.current) dispatch({ type: "compartmentOpened" });
      },
      () => dispatch({ type: "failed", message: FLOW_FAILURE_ERROR }),
    );

  /** opened → verifying → (rental created) → verified → done */
  const confirmBookTaken = () =>
    runExclusive(
      async () => {
        if (flow.step !== "opened" || !book) return;
        dispatch({ type: "bookTaken" });

        const verified = await lockerService.verifyRfid(book.copyId);
        if (!verified) throw new Error(RFID_FAILURE_ERROR);
        if (!mountedRef.current) return;

        // The only place a rental is created: through rentalService, which updates the shared store.
        rentalService.createRental(book, DEFAULT_LOCKER_ID, flow.phone);
        dispatch({ type: "rfidVerified" });

        await delay(VERIFIED_DISPLAY_MS);
        if (mountedRef.current) dispatch({ type: "completed" });
      },
      (error) =>
        dispatch({ type: "failed", message: error instanceof Error ? error.message : FLOW_FAILURE_ERROR }),
    );

  const goBack = () => {
    if (lockRef.current) return;
    if (flow.step === "phone") {
      if (router.canGoBack()) router.back();
      else exitTo(BOOKS_HREF);
    } else {
      dispatch({ type: "back" });
    }
  };

  const goToRentals = () => exitTo(RENTALS_HREF);
  const goToLocker = () => exitTo(LOCKER_HREF);
  const goToBooks = () => exitTo(BOOKS_HREF);

  // Android hardware back: step back before payment, leave after completion, ignore while locker is working.
  const hardwareBackRef = useRef<() => void>(() => undefined);
  hardwareBackRef.current = () => {
    if (flow.step === "done") goToRentals();
    else if (flow.step === "failed") goToLocker();
    else if (isPrePaymentStep(flow.step)) {
      if (eligibility.status === "ready") goBack();
      else goToBooks();
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      hardwareBackRef.current();
      return true;
    });
    return () => subscription.remove();
  }, []);

  return {
    flow,
    busy,
    eligibility,
    book,
    createdRental,
    changePhone,
    submitPhone,
    changeOtp,
    submitOtp,
    confirmPayment,
    confirmBookTaken,
    goBack,
    goToRentals,
    goToLocker,
    goToBooks,
  };
}
