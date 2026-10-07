// Mock service boundaries. Swap these for real integrations later.

import { dueDate, rentalDays, type LockerBook } from "../data/mock";
import type { PaymentResult, Rental } from "../types";
import { getState, setState } from "./demo-store";

export const RENTAL_UNAVAILABLE_ERROR = "Bu kitap şu anda kirada ve yeniden kiralanamaz.";

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
  returnRental: (id: string) => returnService.returnRental(id),
  createRental(book: LockerBook, lockerId: string, phone: string): Rental {
    const existing = getState().rentals.find((rental) => rental.copyId === book.copyId && rental.status === "active");
    if (existing) return existing;
    if (!inventoryService.isAvailable(book)) throw new Error(RENTAL_UNAVAILABLE_ERROR);

    const now = new Date();
    const rental: Rental = {
      id: `r-${now.getTime()}`,
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
  returnRental(rentalId: string, lockerId?: string) {
    const rental = getState().rentals.find((item) => item.id === rentalId);
    if (!rental || rental.status !== "active") return;
    if (lockerId !== undefined && !returnService.canReturnAtLocker(rental, lockerId)) return;

    setState((state) => ({
      ...state,
      rentals: state.rentals.map((item) =>
        item.id === rentalId ? { ...item, status: "returned", returnDate: new Date().toISOString() } : item,
      ),
    }));
    inventoryService.updateBookCopyStatus(rental.copyId, true);
  },
};
