import { describe, expect, it } from "vitest";

import { DEFAULT_LOCKER_ID, getLockerBook } from "../../data/mock";
import { withStatus } from "../demo-store";

describe("Book detail lookup", () => {
  it("resolves a locker book by id", () => {
    const book = getLockerBook(DEFAULT_LOCKER_ID, "devlet");
    expect(book?.title).toBe("Devlet");
  });

  it("returns undefined for unknown book ids", () => {
    expect(getLockerBook(DEFAULT_LOCKER_ID, "missing-book")).toBeUndefined();
  });

  it("applies live availability overrides from demo state", () => {
    const base = getLockerBook(DEFAULT_LOCKER_ID, "kurk-mantolu-madonna")!;
    const unavailable = withStatus(base, {
      copyStatus: { [base.copyId]: false },
      rentals: [],
    });
    expect(unavailable.available).toBe(false);
  });
});
