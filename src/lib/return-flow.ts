// Pure return-flow logic: rental guard, summary data and the step reducer.
// The actual return mutation lives in returnService; nothing here touches the store.

import { books, getLocker, getLockerBook } from "../data/mock";
import type { Book, DemoState, Locker, Rental, ReturnFailureReason } from "../types";
import { lockerService, returnService } from "./mock-services";

export const RETURN_FAILURE_ERROR = "İade tamamlanamadı. Lütfen tekrar dene.";
export const RFID_FAILURE_ERROR = "Kitap doğrulanamadı. Lütfen görevliye başvur.";

export const RETURN_FAILURE_MESSAGES: Record<ReturnFailureReason, string> = {
  not_found: "Kiralama bulunamadı.",
  already_returned: "Bu kitap zaten iade edildi.",
  wrong_locker: "Bu kitap yalnızca aldığın dolaba iade edilebilir.",
};

// ---------- Guard ----------

export type ReturnEligibility =
  | { status: "missing" }
  | { status: "returned" | "invalidData" | "wrongLocker" | "ready"; rental: Rental };

export interface ReturnContext {
  rental: Rental;
  book: Book;
  rentalLocker: Locker;
}

/** Book, copy and original locker of a rental (any status); undefined when the data is inconsistent. */
export function resolveReturnContext(rentalId: string | undefined, state: DemoState): ReturnContext | undefined {
  const rental = rentalId ? state.rentals.find((item) => item.id === rentalId) : undefined;
  if (!rental) return undefined;

  const book = books.find((item) => item.id === rental.bookId);
  const rentalLocker = getLocker(rental.lockerId);
  const copy = getLockerBook(rental.lockerId, rental.bookId);
  if (!book || !rentalLocker || copy?.copyId !== rental.copyId) return undefined;
  return { rental, book, rentalLocker };
}

/** Guard evaluated from the shared store state; the service still re-validates on return. */
export function resolveReturnEligibility(
  rentalId: string | undefined,
  currentLockerId: string,
  state: DemoState,
): ReturnEligibility {
  const rental = rentalId ? state.rentals.find((item) => item.id === rentalId) : undefined;
  if (!rental) return { status: "missing" };
  if (rental.status !== "active") return { status: "returned", rental };
  if (!resolveReturnContext(rentalId, state)) return { status: "invalidData", rental };
  if (!returnService.canReturnAtLocker(rental, currentLockerId)) return { status: "wrongLocker", rental };
  return { status: "ready", rental };
}

// ---------- Summary ----------

export interface ReturnSummary {
  originalLockerName: string;
  returnLockerName: string;
  lockerLocation: string;
  slot: string;
  startDate: string;
  dueDate: string;
}

export function buildReturnSummary(rental: Rental, rentalLocker: Locker, currentLocker: Locker): ReturnSummary {
  return {
    originalLockerName: rentalLocker.name,
    returnLockerName: currentLocker.name,
    lockerLocation: currentLocker.location,
    slot: rental.slot,
    startDate: rental.startDate,
    dueDate: rental.dueDate,
  };
}

// ---------- Completion ----------

/** RFID verification always runs first; the store mutation happens only if it succeeds. */
export async function verifyAndReturn(rental: Rental, lockerId: string): Promise<Rental> {
  const verified = await lockerService.verifyRfid(rental.copyId);
  if (!verified) throw new Error(RFID_FAILURE_ERROR);

  const result = returnService.returnRental(rental.id, lockerId);
  if (!result.ok) throw new Error(RETURN_FAILURE_MESSAGES[result.reason]);
  return result.rental;
}

// ---------- Step reducer ----------

export type ReturnFlowStep =
  | "intro"
  | "checking"
  | "lockerOk"
  | "opened"
  | "verifying"
  | "verified"
  | "done"
  | "failed";

export interface ReturnFlowState {
  step: ReturnFlowStep;
  error: string | null;
}

export type ReturnFlowAction =
  | { type: "started" }
  | { type: "lockerVerified" }
  | { type: "compartmentOpened" }
  | { type: "bookPlaced" }
  | { type: "rfidVerified" }
  | { type: "completed" }
  | { type: "failed"; message: string };

export const initialReturnFlowState: ReturnFlowState = { step: "intro", error: null };

/** Every transition is guarded by the current step, so repeated/out-of-order actions are no-ops. */
export function returnFlowReducer(state: ReturnFlowState, action: ReturnFlowAction): ReturnFlowState {
  switch (action.type) {
    case "started":
      return state.step === "intro" ? { ...state, step: "checking" } : state;
    case "lockerVerified":
      return state.step === "checking" ? { ...state, step: "lockerOk" } : state;
    case "compartmentOpened":
      return state.step === "lockerOk" ? { ...state, step: "opened" } : state;
    case "bookPlaced":
      return state.step === "opened" ? { ...state, step: "verifying" } : state;
    case "rfidVerified":
      return state.step === "verifying" ? { ...state, step: "verified" } : state;
    case "completed":
      return state.step === "verified" ? { ...state, step: "done" } : state;
    case "failed":
      return state.step === "done" ? state : { step: "failed", error: action.message };
    default:
      return state;
  }
}
