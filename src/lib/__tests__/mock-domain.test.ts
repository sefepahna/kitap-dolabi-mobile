import { describe, expect, it, beforeEach } from "vitest";

import { DEFAULT_LOCKER_ID, getLockerBook } from "../../data/mock";
import { getState, resetDemoStore } from "../demo-store";
import { authService, inventoryService, rentalService, returnService } from "../mock-services";

beforeEach(() => {
  resetDemoStore();
});

describe("mock domain", () => {
  it("starts with seeded copy availability", () => {
    const book = getLockerBook(DEFAULT_LOCKER_ID, "kurk-mantolu-madonna");
    expect(book).toBeDefined();
    expect(inventoryService.isAvailable(book!)).toBe(true);
  });

  it("creates a rental and marks the copy unavailable", () => {
    const book = getLockerBook(DEFAULT_LOCKER_ID, "kurk-mantolu-madonna")!;
    const rental = rentalService.createRental(book, DEFAULT_LOCKER_ID, "5551234567");

    expect(rental.status).toBe("active");
    expect(getState().rentals.some((item) => item.id === rental.id)).toBe(true);
    expect(inventoryService.isAvailable(book)).toBe(false);
  });

  it("returns a rental and restores availability", () => {
    const book = getLockerBook(DEFAULT_LOCKER_ID, "kurk-mantolu-madonna")!;
    const rental = rentalService.createRental(book, DEFAULT_LOCKER_ID, "5551234567");

    returnService.returnRental(rental.id, DEFAULT_LOCKER_ID);

    const updated = getState().rentals.find((item) => item.id === rental.id);
    expect(updated?.status).toBe("returned");
    expect(inventoryService.isAvailable(book)).toBe(true);
  });

  it("rejects invalid OTP and accepts demo code", async () => {
    expect(await authService.verifyOtp("000000")).toBe(false);
    expect(await authService.verifyOtp("123456")).toBe(true);
  });

  it("enforces same-locker return", () => {
    const book = getLockerBook(DEFAULT_LOCKER_ID, "kurk-mantolu-madonna")!;
    const rental = rentalService.createRental(book, DEFAULT_LOCKER_ID, "5551234567");

    returnService.returnRental(rental.id, "other-locker");
    expect(getState().rentals.find((item) => item.id === rental.id)?.status).toBe("active");

    returnService.returnRental(rental.id, DEFAULT_LOCKER_ID);
    expect(getState().rentals.find((item) => item.id === rental.id)?.status).toBe("returned");
  });
});
