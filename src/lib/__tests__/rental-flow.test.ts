import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_LOCKER_ID, dueDate, getLockerBook, rentalDays } from "../../data/mock";
import { getActiveRentals, getState, resetDemoStore } from "../demo-store";
import { authService, inventoryService, rentalService, RENTAL_UNAVAILABLE_ERROR } from "../mock-services";
import {
  OTP_ERROR,
  buildRentalSummary,
  formatPhone,
  getLockerSlots,
  initialRentalFlowState,
  isCompleteOtp,
  isValidPhone,
  normalizeOtpInput,
  normalizePhoneInput,
  rentalFlowReducer,
  resolveRentalEligibility,
  type RentalFlowAction,
  type RentalFlowState,
} from "../rental-flow";

const AVAILABLE_BOOK_ID = "kurk-mantolu-madonna";
const SEEDED_RENTED_BOOK_ID = "donusum";
const PHONE = "5321234567";

const getBook = (id: string) => getLockerBook(DEFAULT_LOCKER_ID, id)!;
const run = (actions: RentalFlowAction[], from: RentalFlowState = initialRentalFlowState) =>
  actions.reduce(rentalFlowReducer, from);

beforeEach(() => {
  resetDemoStore();
});

describe("phone validation", () => {
  it("accepts a 10-digit mobile number starting with 5", () => {
    expect(isValidPhone(PHONE)).toBe(true);
  });

  it.each(["", "532123456", "53212345678", "4321234567", "532123456a"])("rejects %j", (value) => {
    expect(isValidPhone(value)).toBe(false);
  });

  it("normalizes formatting, leading 0 and +90 prefix", () => {
    expect(normalizePhoneInput("0532 123 45 67")).toBe(PHONE);
    expect(normalizePhoneInput("+90 532 123 45 67")).toBe(PHONE);
    expect(normalizePhoneInput("532123456789")).toBe(PHONE);
  });

  it("formats as 5XX XXX XX XX", () => {
    expect(formatPhone(PHONE)).toBe("532 123 45 67");
  });
});

describe("OTP", () => {
  it("normalizes input to at most 6 digits", () => {
    expect(normalizeOtpInput("12a3456789")).toBe("123456");
    expect(isCompleteOtp("12345")).toBe(false);
    expect(isCompleteOtp("123456")).toBe(true);
  });

  it("accepts the demo code and rejects others through authService", async () => {
    expect(await authService.verifyOtp("123456")).toBe(true);
    expect(await authService.verifyOtp("654321")).toBe(false);
  });
});

describe("rental summary", () => {
  it("uses rentalDays and calculates the return date", () => {
    const book = getBook(AVAILABLE_BOOK_ID);
    const from = new Date(2026, 9, 7);
    const summary = buildRentalSummary(book, DEFAULT_LOCKER_ID, from);

    expect(summary.days).toBe(rentalDays(book.pages));
    expect(summary.days).toBe(10);
    expect(summary.returnOn).toEqual(dueDate(10, from));
    expect(summary.slot).toBe(book.slot);
    expect(summary.fee).toBe(book.fee);
    expect(summary.paymentLabel).toContain("4545");
  });

  it("lists every locker compartment from inventory data", () => {
    expect(getLockerSlots(DEFAULT_LOCKER_ID)).toHaveLength(12);
  });
});

describe("eligibility guard", () => {
  it("reports missing for unknown or absent book ids", () => {
    expect(resolveRentalEligibility(undefined, DEFAULT_LOCKER_ID, getState()).status).toBe("missing");
    expect(resolveRentalEligibility("nope", DEFAULT_LOCKER_ID, getState()).status).toBe("missing");
  });

  it("is ready for an available book and unavailable for a seeded rented one", () => {
    expect(resolveRentalEligibility(AVAILABLE_BOOK_ID, DEFAULT_LOCKER_ID, getState()).status).toBe("ready");
    expect(resolveRentalEligibility(SEEDED_RENTED_BOOK_ID, DEFAULT_LOCKER_ID, getState()).status).toBe("unavailable");
  });
});

describe("rental creation through the shared store", () => {
  it("creates an active rental and flips availability", () => {
    const book = getBook(AVAILABLE_BOOK_ID);
    const rental = rentalService.createRental(book, DEFAULT_LOCKER_ID, PHONE);

    expect(rental).toMatchObject({
      copyId: book.copyId,
      bookId: book.id,
      lockerId: DEFAULT_LOCKER_ID,
      slot: book.slot,
      status: "active",
    });
    expect(rental.dueDate).toBe(dueDate(rentalDays(book.pages), new Date(rental.startDate)).toISOString());
    expect(getActiveRentals()).toHaveLength(1);
    expect(inventoryService.isAvailable(book)).toBe(false);
    expect(resolveRentalEligibility(AVAILABLE_BOOK_ID, DEFAULT_LOCKER_ID, getState()).status).toBe("unavailable");
  });

  it("does not create duplicate active rentals on repeated completion", () => {
    const book = getBook(AVAILABLE_BOOK_ID);
    const first = rentalService.createRental(book, DEFAULT_LOCKER_ID, PHONE);
    const second = rentalService.createRental(book, DEFAULT_LOCKER_ID, PHONE);

    expect(second.id).toBe(first.id);
    expect(getActiveRentals()).toHaveLength(1);
  });

  it("refuses to rent a copy that is already unavailable", () => {
    const book = getBook(SEEDED_RENTED_BOOK_ID);

    expect(() => rentalService.createRental(book, DEFAULT_LOCKER_ID, PHONE)).toThrow(RENTAL_UNAVAILABLE_ERROR);
    expect(getActiveRentals()).toHaveLength(0);
  });
});

describe("flow reducer", () => {
  it("walks the happy path in the required order", () => {
    const steps: string[] = [initialRentalFlowState.step];
    let state = initialRentalFlowState;
    const actions: RentalFlowAction[] = [
      { type: "phoneChanged", value: PHONE },
      { type: "otpRequested" },
      { type: "otpChanged", value: "123456" },
      { type: "otpVerified" },
      { type: "paymentStarted" },
      { type: "paymentSucceeded" },
      { type: "compartmentOpened" },
      { type: "bookTaken" },
      { type: "rfidVerified" },
      { type: "completed" },
    ];
    for (const action of actions) {
      state = rentalFlowReducer(state, action);
      if (steps[steps.length - 1] !== state.step) steps.push(state.step);
    }

    expect(steps).toEqual([
      "phone", "otp", "summary", "paying", "preparing", "opened", "verifying", "verified", "done",
    ]);
  });

  it("stays on otp with an error when the code is rejected, then lets the user correct it", () => {
    let state = run([{ type: "phoneChanged", value: PHONE }, { type: "otpRequested" }]);
    state = run([{ type: "otpChanged", value: "000000" }, { type: "otpRejected" }], state);
    expect(state).toMatchObject({ step: "otp", error: OTP_ERROR, otp: "000000" });

    state = run([{ type: "otpChanged", value: "12345" }], state);
    expect(state).toMatchObject({ step: "otp", error: null, otp: "12345" });
  });

  it("ignores out-of-order and repeated actions", () => {
    expect(run([{ type: "paymentStarted" }]).step).toBe("phone");

    const summary = run([
      { type: "phoneChanged", value: PHONE },
      { type: "otpRequested" },
      { type: "otpVerified" },
    ]);
    const paying = run([{ type: "paymentStarted" }, { type: "paymentStarted" }], summary);
    expect(paying.step).toBe("paying");
    expect(run([{ type: "bookTaken" }], paying).step).toBe("paying");
  });

  it("goes back phone ← otp ← summary and never back during the locker sequence", () => {
    const summary = run([
      { type: "phoneChanged", value: PHONE },
      { type: "otpRequested" },
      { type: "otpVerified" },
    ]);
    expect(run([{ type: "back" }], summary).step).toBe("otp");
    expect(run([{ type: "back" }, { type: "back" }], summary).step).toBe("phone");

    const paying = run([{ type: "paymentStarted" }], summary);
    expect(run([{ type: "back" }], paying).step).toBe("paying");
  });

  it("returns to summary with an error when payment fails", () => {
    const paying = run([
      { type: "phoneChanged", value: PHONE },
      { type: "otpRequested" },
      { type: "otpVerified" },
      { type: "paymentStarted" },
      { type: "paymentFailed", message: "hata" },
    ]);
    expect(paying).toMatchObject({ step: "summary", error: "hata" });
  });
});
