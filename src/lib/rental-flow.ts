// Pure rental-flow logic: input validation, eligibility guard, summary data and the step reducer.
// No React, no services — the screen/hook wires these to the shared demo store and mock services.

import { dueDate, getLocker, getLockerBook, getLockerBooks, rentalDays } from "../data/mock";
import type { DemoState, LockerBook } from "../types";
import { withStatus } from "./demo-store";

export const PHONE_LENGTH = 10;
export const MOBILE_PREFIX = "5";
export const OTP_LENGTH = 6;
export const VERIFIED_DISPLAY_MS = 1200;
export const DEMO_PAYMENT_LABEL = "Kredi kartı **** 4545";

export const PHONE_ERROR = "Geçerli bir cep telefonu numarası gir.";
export const OTP_ERROR = "Kod hatalı. Lütfen tekrar dene.";
export const FLOW_FAILURE_ERROR = "İşlem tamamlanamadı. Lütfen tekrar dene.";

// ---------- Input helpers ----------

const NON_DIGITS = /\D/g;
const VALID_PHONE_PATTERN = new RegExp(`^${MOBILE_PREFIX}\\d{${PHONE_LENGTH - 1}}$`);
const COUNTRY_CODE = "90";
const INTERNATIONAL_LENGTH = COUNTRY_CODE.length + PHONE_LENGTH;

/** Keeps digits only, drops +90 / leading 0 and limits to 10 digits. */
export function normalizePhoneInput(raw: string): string {
  let digits = raw.replace(NON_DIGITS, "");
  if (digits.length === INTERNATIONAL_LENGTH && digits.startsWith(COUNTRY_CODE)) {
    digits = digits.slice(COUNTRY_CODE.length);
  }
  return digits.replace(/^0/, "").slice(0, PHONE_LENGTH);
}

/** `5XX XXX XX XX` display format. */
export function formatPhone(digits: string): string {
  const d = digits.slice(0, PHONE_LENGTH);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(" ");
}

export function isValidPhone(phone: string): boolean {
  return VALID_PHONE_PATTERN.test(phone);
}

export function normalizeOtpInput(raw: string): string {
  return raw.replace(NON_DIGITS, "").slice(0, OTP_LENGTH);
}

export function isCompleteOtp(code: string): boolean {
  return code.length === OTP_LENGTH;
}

// ---------- Eligibility guard ----------

export type RentalEligibility =
  | { status: "missing" }
  | { status: "unavailable"; book: LockerBook }
  | { status: "ready"; book: LockerBook };

/** Resolves the book through the domain layer and live availability from the shared store state. */
export function resolveRentalEligibility(
  bookId: string | undefined,
  lockerId: string,
  state: DemoState,
): RentalEligibility {
  const baseBook = bookId ? getLockerBook(lockerId, bookId) : undefined;
  if (!baseBook) return { status: "missing" };

  const book = withStatus(baseBook, state);
  return book.available ? { status: "ready", book } : { status: "unavailable", book };
}

// ---------- Summary ----------

export interface RentalSummary {
  lockerName: string;
  slot: string;
  days: number;
  returnOn: Date;
  fee: number;
  paymentLabel: string;
}

export function buildRentalSummary(book: LockerBook, lockerId: string, from = new Date()): RentalSummary {
  const days = rentalDays(book.pages);
  return {
    lockerName: getLocker(lockerId)?.name ?? lockerId,
    slot: book.slot,
    days,
    returnOn: dueDate(days, from),
    fee: book.fee,
    paymentLabel: DEMO_PAYMENT_LABEL,
  };
}

/** All compartment ids of a locker, from the inventory data. */
export function getLockerSlots(lockerId: string): string[] {
  return getLockerBooks(lockerId)
    .map((item) => item.slot)
    .sort();
}

// ---------- Step reducer ----------

export type RentalFlowStep =
  | "phone"
  | "otp"
  | "summary"
  | "paying"
  | "preparing"
  | "opened"
  | "verifying"
  | "verified"
  | "done"
  | "failed";

export const PRE_PAYMENT_STEPS: readonly RentalFlowStep[] = ["phone", "otp", "summary"];

export interface RentalFlowState {
  step: RentalFlowStep;
  phone: string;
  otp: string;
  error: string | null;
}

export type RentalFlowAction =
  | { type: "phoneChanged"; value: string }
  | { type: "validationFailed"; message: string }
  | { type: "otpRequested" }
  | { type: "otpChanged"; value: string }
  | { type: "otpVerified" }
  | { type: "otpRejected" }
  | { type: "back" }
  | { type: "paymentStarted" }
  | { type: "paymentFailed"; message: string }
  | { type: "paymentSucceeded" }
  | { type: "compartmentOpened" }
  | { type: "bookTaken" }
  | { type: "rfidVerified" }
  | { type: "completed" }
  | { type: "failed"; message: string };

export const initialRentalFlowState: RentalFlowState = { step: "phone", phone: "", otp: "", error: null };

export function isPrePaymentStep(step: RentalFlowStep): boolean {
  return PRE_PAYMENT_STEPS.includes(step);
}

/** Every transition is guarded by the current step, so repeated/out-of-order actions are no-ops. */
export function rentalFlowReducer(state: RentalFlowState, action: RentalFlowAction): RentalFlowState {
  const { step } = state;

  switch (action.type) {
    case "phoneChanged":
      return step === "phone" ? { ...state, phone: normalizePhoneInput(action.value), error: null } : state;
    case "validationFailed":
      return isPrePaymentStep(step) ? { ...state, error: action.message } : state;
    case "otpRequested":
      return step === "phone" ? { ...state, step: "otp", error: null } : state;
    case "otpChanged":
      return step === "otp" ? { ...state, otp: normalizeOtpInput(action.value), error: null } : state;
    case "otpVerified":
      return step === "otp" ? { ...state, step: "summary", error: null } : state;
    case "otpRejected":
      return step === "otp" ? { ...state, error: OTP_ERROR } : state;
    case "back":
      if (step === "otp") return { ...state, step: "phone", error: null };
      if (step === "summary") return { ...state, step: "otp", error: null };
      return state;
    case "paymentStarted":
      return step === "summary" ? { ...state, step: "paying", error: null } : state;
    case "paymentFailed":
      return step === "paying" ? { ...state, step: "summary", error: action.message } : state;
    case "paymentSucceeded":
      return step === "paying" ? { ...state, step: "preparing" } : state;
    case "compartmentOpened":
      return step === "preparing" ? { ...state, step: "opened" } : state;
    case "bookTaken":
      return step === "opened" ? { ...state, step: "verifying" } : state;
    case "rfidVerified":
      return step === "verifying" ? { ...state, step: "verified" } : state;
    case "completed":
      return step === "verified" ? { ...state, step: "done" } : state;
    case "failed":
      return step === "done" ? state : { ...state, step: "failed", error: action.message };
    default:
      return state;
  }
}
