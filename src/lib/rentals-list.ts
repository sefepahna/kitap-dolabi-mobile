import { mockHistory } from "../data/mock";
import type { DemoState, MockHistoryEntry, Rental } from "../types";

const DAY_MS = 86_400_000;

export function daysLeft(dueDate: string): number {
  const end = new Date(dueDate);
  end.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - now.getTime()) / DAY_MS);
}

export function getActiveRentalsFromState(state: DemoState): Rental[] {
  return state.rentals.filter((rental) => rental.status === "active");
}

export function getRentalHistoryFromState(state: DemoState, historySeed: MockHistoryEntry[] = mockHistory): MockHistoryEntry[] {
  const returnedFromStore: MockHistoryEntry[] = state.rentals
    .filter((rental) => rental.status === "returned" && rental.returnDate)
    .map((rental) => ({
      id: rental.id,
      bookId: rental.bookId,
      lockerId: rental.lockerId,
      startDate: rental.startDate,
      returnDate: rental.returnDate!,
    }));

  return [...returnedFromStore, ...historySeed];
}

export function formatDueMessage(dueDate: string): string {
  const left = daysLeft(dueDate);
  if (left > 0) return `İadeye ${left} gün kaldı`;
  if (left === 0) return "İade günü bugün";
  return `İade ${-left} gün gecikti`;
}

export function getReturnRoute(rentalId: string): `/iade/${string}` {
  return `/iade/${rentalId}`;
}
