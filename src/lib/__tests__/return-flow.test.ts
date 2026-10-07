import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_LOCKER_ID, getLockerBook } from "../../data/mock";
import type { Rental } from "../../types";
import { getActiveRentals, getState, resetDemoStore } from "../demo-store";
import { inventoryService, lockerService, rentalService, returnService } from "../mock-services";
import { getActiveRentalsFromState, getRentalHistoryFromState } from "../rentals-list";
import {
  RETURN_FAILURE_MESSAGES,
  RFID_FAILURE_ERROR,
  buildReturnSummary,
  initialReturnFlowState,
  resolveReturnContext,
  resolveReturnEligibility,
  returnFlowReducer,
  verifyAndReturn,
  type ReturnFlowAction,
} from "../return-flow";
import { getLocker } from "../../data/mock";

const OTHER_LOCKER = "other-locker";
const book = () => getLockerBook(DEFAULT_LOCKER_ID, "kurk-mantolu-madonna")!;
const rent = (): Rental => rentalService.createRental(book(), DEFAULT_LOCKER_ID, "5321234567");
const run = (actions: ReturnFlowAction[]) => actions.reduce(returnFlowReducer, initialReturnFlowState);

beforeEach(() => {
  resetDemoStore();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("return eligibility", () => {
  it("is ready for an active rental at its own locker", () => {
    const rental = rent();
    expect(resolveReturnEligibility(rental.id, DEFAULT_LOCKER_ID, getState()).status).toBe("ready");
    expect(resolveReturnContext(rental.id, getState())?.book.id).toBe(book().id);
  });

  it("reports missing for unknown or absent rental ids", () => {
    expect(resolveReturnEligibility(undefined, DEFAULT_LOCKER_ID, getState()).status).toBe("missing");
    expect(resolveReturnEligibility("r-nope", DEFAULT_LOCKER_ID, getState()).status).toBe("missing");
  });

  it("reports wrong locker without changing state", () => {
    const rental = rent();
    const before = getState();

    expect(resolveReturnEligibility(rental.id, OTHER_LOCKER, getState()).status).toBe("wrongLocker");
    expect(getState()).toBe(before);
  });

  it("reports returned once the rental has been returned", () => {
    const rental = rent();
    returnService.returnRental(rental.id, DEFAULT_LOCKER_ID);
    expect(resolveReturnEligibility(rental.id, DEFAULT_LOCKER_ID, getState()).status).toBe("returned");
  });

  it("reports invalid data when the copy does not match the rental", () => {
    rent();
    const broken = { ...getState().rentals[0]!, copyId: "bk-unknown" };
    expect(resolveReturnEligibility(broken.id, DEFAULT_LOCKER_ID, { copyStatus: {}, rentals: [broken] }).status).toBe(
      "invalidData",
    );
  });
});

describe("returnService", () => {
  it("returns an active rental, restores availability and keeps history", () => {
    const rental = rent();
    const result = returnService.returnRental(rental.id, DEFAULT_LOCKER_ID);

    expect(result.ok).toBe(true);
    expect(getState().rentals.find((item) => item.id === rental.id)).toMatchObject({ status: "returned" });
    expect(getState().rentals[0]?.returnDate).toBeDefined();
    expect(inventoryService.isAvailable(book())).toBe(true);
    expect(getActiveRentals()).toHaveLength(0);
    expect(getActiveRentalsFromState(getState())).toHaveLength(0);
    expect(getRentalHistoryFromState(getState()).some((entry) => entry.id === rental.id)).toBe(true);
  });

  it("rejects a missing rental", () => {
    expect(returnService.returnRental("r-nope", DEFAULT_LOCKER_ID)).toEqual({ ok: false, reason: "not_found" });
  });

  it("rejects a wrong locker and mutates nothing", () => {
    const rental = rent();
    const before = getState();

    expect(returnService.returnRental(rental.id, OTHER_LOCKER)).toEqual({ ok: false, reason: "wrong_locker" });
    expect(getState()).toBe(before);
    expect(inventoryService.isAvailable(book())).toBe(false);
  });

  it("rejects returning twice and keeps state intact", () => {
    const rental = rent();
    returnService.returnRental(rental.id, DEFAULT_LOCKER_ID);
    const afterFirst = getState();

    expect(returnService.returnRental(rental.id, DEFAULT_LOCKER_ID)).toEqual({ ok: false, reason: "already_returned" });
    expect(getState()).toBe(afterFirst);
    expect(getState().rentals.filter((item) => item.status === "returned")).toHaveLength(1);
  });

  it("allows renting the same copy again after it was returned", () => {
    const first = rent();
    returnService.returnRental(first.id, DEFAULT_LOCKER_ID);
    const second = rent();

    expect(second.id).not.toBe(first.id);
    expect(getActiveRentals()).toHaveLength(1);
  });
});

describe("verifyAndReturn", () => {
  it("runs RFID verification before the return mutation", async () => {
    const rental = rent();
    const order: string[] = [];
    const verify = vi.spyOn(lockerService, "verifyRfid").mockImplementation(async () => {
      order.push(`rfid(active=${getActiveRentals().length})`);
      return true;
    });
    vi.spyOn(returnService, "returnRental").mockImplementation(() => {
      order.push("return");
      return { ok: true, rental };
    });

    await verifyAndReturn(rental, DEFAULT_LOCKER_ID);

    expect(verify).toHaveBeenCalledWith(rental.copyId);
    expect(order).toEqual(["rfid(active=1)", "return"]);
  });

  it("does not return the rental when RFID verification fails", async () => {
    const rental = rent();
    vi.spyOn(lockerService, "verifyRfid").mockResolvedValue(false);

    await expect(verifyAndReturn(rental, DEFAULT_LOCKER_ID)).rejects.toThrow(RFID_FAILURE_ERROR);
    expect(getActiveRentals()).toHaveLength(1);
    expect(inventoryService.isAvailable(book())).toBe(false);
  });

  it("rejects a wrong locker with a clear message and no mutation", async () => {
    const rental = rent();
    vi.spyOn(lockerService, "verifyRfid").mockResolvedValue(true);

    await expect(verifyAndReturn(rental, OTHER_LOCKER)).rejects.toThrow(RETURN_FAILURE_MESSAGES.wrong_locker);
    expect(getActiveRentals()).toHaveLength(1);
  });

  it("returns the rental on success", async () => {
    const rental = rent();
    vi.spyOn(lockerService, "verifyRfid").mockResolvedValue(true);

    const returned = await verifyAndReturn(rental, DEFAULT_LOCKER_ID);

    expect(returned.status).toBe("returned");
    expect(inventoryService.isAvailable(book())).toBe(true);
  });
});

describe("return summary", () => {
  it("is built from rental and locker data", () => {
    const rental = rent();
    const locker = getLocker(DEFAULT_LOCKER_ID)!;
    const summary = buildReturnSummary(rental, locker, locker);

    expect(summary).toMatchObject({
      originalLockerName: locker.name,
      returnLockerName: locker.name,
      slot: rental.slot,
      dueDate: rental.dueDate,
      startDate: rental.startDate,
    });
  });
});

describe("return flow reducer", () => {
  it("walks the web sequence in order", () => {
    const steps = [
      "started", "lockerVerified", "compartmentOpened", "bookPlaced", "rfidVerified", "completed",
    ] as const;
    let state = initialReturnFlowState;
    const visited = [state.step];
    for (const type of steps) {
      state = returnFlowReducer(state, { type });
      visited.push(state.step);
    }

    expect(visited).toEqual(["intro", "checking", "lockerOk", "opened", "verifying", "verified", "done"]);
  });

  it("ignores out-of-order and repeated actions", () => {
    expect(run([{ type: "bookPlaced" }]).step).toBe("intro");
    expect(run([{ type: "started" }, { type: "started" }]).step).toBe("checking");
    expect(run([{ type: "started" }, { type: "completed" }]).step).toBe("checking");
  });

  it("moves to failed with a message but never leaves done", () => {
    expect(run([{ type: "started" }, { type: "failed", message: "x" }])).toEqual({ step: "failed", error: "x" });

    const done = run([
      { type: "started" }, { type: "lockerVerified" }, { type: "compartmentOpened" },
      { type: "bookPlaced" }, { type: "rfidVerified" }, { type: "completed" },
    ]);
    expect(returnFlowReducer(done, { type: "failed", message: "x" }).step).toBe("done");
  });
});
