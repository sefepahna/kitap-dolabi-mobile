import { describe, expect, it } from "vitest";

import { mockHistory } from "../../data/mock";
import type { Rental } from "../../types";
import {
  getActiveRentalsFromState,
  getRentalHistoryFromState,
  getReturnRoute,
} from "../rentals-list";

const activeRental: Rental = {
  id: "r-test",
  copyId: "bk-a1",
  bookId: "kurk-mantolu-madonna",
  lockerId: "bogazici-kuzey",
  slot: "A1",
  fee: 40,
  startDate: "2026-10-01T10:00:00.000Z",
  dueDate: "2026-10-15T10:00:00.000Z",
  status: "active",
  phone: "5551234567",
};

const returnedRental: Rental = {
  ...activeRental,
  id: "r-returned",
  status: "returned",
  returnDate: "2026-10-10T10:00:00.000Z",
};

describe("rentals list", () => {
  it("returns zero active rentals for empty store state", () => {
    expect(getActiveRentalsFromState({ copyStatus: {}, rentals: [] })).toEqual([]);
  });

  it("derives active rentals from store state", () => {
    const active = getActiveRentalsFromState({ copyStatus: {}, rentals: [activeRental, returnedRental] });
    expect(active).toHaveLength(1);
    expect(active[0]?.id).toBe("r-test");
  });

  it("includes mock history and returned rentals in history list", () => {
    const history = getRentalHistoryFromState({ copyStatus: {}, rentals: [returnedRental] });
    expect(history.some((entry) => entry.id === "r-returned")).toBe(true);
    expect(history.some((entry) => entry.id === mockHistory[0]?.id)).toBe(true);
  });

  it("builds the return route from rental id", () => {
    expect(getReturnRoute("r-test")).toBe("/iade/r-test");
  });
});
