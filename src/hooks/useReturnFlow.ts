// Wires the pure return-flow reducer to the mock locker services and the shared demo store.
// The return itself happens only in returnService.returnRental, after RFID verification.

import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useEffect, useReducer, useRef, useState } from "react";
import { BackHandler } from "react-native";

import { DEFAULT_LOCKER_ID } from "../data/mock";
import { delay } from "../lib/delay";
import { useDemoState } from "../lib/demo-store";
import { lockerService } from "../lib/mock-services";
import {
  RETURN_FAILURE_ERROR,
  initialReturnFlowState,
  resolveReturnContext,
  resolveReturnEligibility,
  returnFlowReducer,
  verifyAndReturn,
} from "../lib/return-flow";
import { VERIFIED_DISPLAY_MS } from "../lib/rental-flow";
import { useFlowExit } from "./useFlowExit";

const RENTALS_HREF: Href = "/(locker)/rentals";

export function useReturnFlow() {
  const { rentalId } = useLocalSearchParams<{ rentalId: string }>();
  const demoState = useDemoState();
  const router = useRouter();
  const exitTo = useFlowExit();
  const [flow, dispatch] = useReducer(returnFlowReducer, initialReturnFlowState);
  const [busy, setBusy] = useState(false);
  const lockRef = useRef(false);
  const mountedRef = useRef(true);

  const eligibility = resolveReturnEligibility(
    typeof rentalId === "string" ? rentalId : undefined,
    DEFAULT_LOCKER_ID,
    demoState,
  );
  // After a successful return the rental is no longer "active", so in-flow steps read it from the store directly.
  const context = resolveReturnContext(typeof rentalId === "string" ? rentalId : undefined, demoState);
  const rental = context?.rental;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /** Runs one async action at a time; repeated taps while it runs are ignored. */
  const runExclusive = async (task: () => Promise<void>) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setBusy(true);
    try {
      await task();
    } catch (error) {
      console.error("[return-flow]", error);
      if (mountedRef.current) {
        dispatch({ type: "failed", message: error instanceof Error ? error.message : RETURN_FAILURE_ERROR });
      }
    } finally {
      lockRef.current = false;
      if (mountedRef.current) setBusy(false);
    }
  };

  /** intro → checking → lockerOk → opened */
  const start = () =>
    runExclusive(async () => {
      if (flow.step !== "intro" || eligibility.status !== "ready") return;
      dispatch({ type: "started" });

      await lockerService.verifyLocker(DEFAULT_LOCKER_ID);
      if (!mountedRef.current) return;
      dispatch({ type: "lockerVerified" });

      await lockerService.openCompartment(eligibility.rental.lockerId, eligibility.rental.slot);
      if (mountedRef.current) dispatch({ type: "compartmentOpened" });
    });

  /** opened → verifying → (rental returned) → verified → done */
  const confirmBookPlaced = () =>
    runExclusive(async () => {
      if (flow.step !== "opened" || !rental) return;
      dispatch({ type: "bookPlaced" });

      // The only place a rental is returned: RFID first, then returnService (which enforces the same-locker rule).
      await verifyAndReturn(rental, DEFAULT_LOCKER_ID);
      if (!mountedRef.current) return;
      dispatch({ type: "rfidVerified" });

      await delay(VERIFIED_DISPLAY_MS);
      if (mountedRef.current) dispatch({ type: "completed" });
    });

  const goToRentals = () => exitTo(RENTALS_HREF);

  const goBack = () => {
    if (lockRef.current) return;
    if (router.canGoBack()) router.back();
    else goToRentals();
  };

  // Android hardware back: leave on intro/guards/done/failed, ignore while the locker is working.
  const hardwareBackRef = useRef<() => void>(() => undefined);
  hardwareBackRef.current = () => {
    if (flow.step === "intro") goBack();
    else if (flow.step === "done" || flow.step === "failed") goToRentals();
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      hardwareBackRef.current();
      return true;
    });
    return () => subscription.remove();
  }, []);

  return { flow, busy, eligibility, context, start, confirmBookPlaced, goBack, goToRentals };
}
