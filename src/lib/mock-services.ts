// Mock service boundaries. Swap these for real integrations later.

import { dueDate, rentalDays, type LockerBook } from "../data/mock";
import type { PaymentResult, Rental, ReturnResult } from "../types";
import { getState, setState } from "./demo-store";

export const RENTAL_UNAVAILABLE_ERROR = "Bu kitap şu anda kirada ve yeniden kiralanamaz.";

let rentalSequence = 0;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async sendOtp(_phone: string) {
    await wait(800);
  },
  async verifyOtp(code: string) {
    await wait(700);
    return code === "123456";
  },
};

export const paymentService = {
  async processPayment(_amount: number): Promise<PaymentResult> {
    await wait(1600);
    return { ok: true as const };
  },
};

export const lockerService = {
  async openCompartment(_lockerId: string, slot: string) {
    await wait(1500);
    return { slot };
  },
  async verifyLocker(_lockerId: string) {
    await wait(1500);
    return true;
  },
  async verifyRfid(_copyId: string) {
    await wait(1800);
    return true;
  },
};

export const inventoryService = {
  updateBookCopyStatus(copyId: string, available: boolean) {
    setState((state) => ({
      ...state,
      copyStatus: { ...state.copyStatus, [copyId]: available },
    }));
  },
  isAvailable(book: LockerBook) {
    const override = getState().copyStatus[book.copyId];
    return override ?? book.available;
  },
};

export const rentalService = {
  returnRental: (id: string, lockerId: string) => returnService.returnRental(id, lockerId),
  createRental(book: LockerBook, lockerId: string, phone: string): Rental {
    const existing = getState().rentals.find((rental) => rental.copyId === book.copyId && rental.status === "active");
    if (existing) return existing;
    if (!inventoryService.isAvailable(book)) throw new Error(RENTAL_UNAVAILABLE_ERROR);

    const now = new Date();
    const rental: Rental = {
      id: `r-${now.getTime()}-${++rentalSequence}`,
      copyId: book.copyId,
      bookId: book.id,
      lockerId,
      slot: book.slot,
      fee: book.fee,
      startDate: now.toISOString(),
      dueDate: dueDate(rentalDays(book.pages), now).toISOString(),
      status: "active",
      phone,
    };

    setState((state) => ({ ...state, rentals: [rental, ...state.rentals] }));
    inventoryService.updateBookCopyStatus(book.copyId, false);
    return rental;
  },
};

export const returnService = {
  /** Return must happen at the locker where the rental was created. */
  canReturnAtLocker(rental: Rental, lockerId: string) {
    return rental.lockerId === lockerId;
  },
  /** Authoritative return: validates rental state and locker identity, then updates the shared store. */
  returnRental(rentalId: string, lockerId: string): ReturnResult {
    const rental = getState().rentals.find((item) => item.id === rentalId);
    if (!rental) return { ok: false, reason: "not_found" };
    if (rental.status !== "active") return { ok: false, reason: "already_returned" };
    if (!returnService.canReturnAtLocker(rental, lockerId)) return { ok: false, reason: "wrong_locker" };

    const returned: Rental = { ...rental, status: "returned", returnDate: new Date().toISOString() };
    setState((state) => ({
      ...state,
      rentals: state.rentals.map((item) => (item.id === rentalId ? returned : item)),
    }));
    inventoryService.updateBookCopyStatus(rental.copyId, true);
    return { ok: true, rental: returned };
  },
};
