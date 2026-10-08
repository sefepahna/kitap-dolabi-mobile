import { describe, expect, it } from "vitest";

import { DEFAULT_LOCKER_ID } from "../../data/mock";
import { resolveMockQrScan } from "../mock-qr";
import {
  emptyEntryState,
  normalizeEntryState,
  parsePersistedEntryState,
  resolveInitialRoute,
  serializeEntryState,
  validateLockerId,
} from "../entry-state";

describe("validateLockerId", () => {
  it("accepts the demo locker", () => {
    expect(validateLockerId(DEFAULT_LOCKER_ID)).toBe(DEFAULT_LOCKER_ID);
  });

  it("rejects unknown locker ids", () => {
    expect(validateLockerId("unknown-locker")).toBeNull();
    expect(validateLockerId(null)).toBeNull();
  });
});

describe("resolveInitialRoute", () => {
  it("routes incomplete onboarding to onboarding", () => {
    expect(resolveInitialRoute(emptyEntryState)).toBe("/onboarding");
  });

  it("routes completed onboarding with remembered locker to the app", () => {
    expect(
      resolveInitialRoute({
        hasCompletedOnboarding: true,
        selectedLockerId: DEFAULT_LOCKER_ID,
      }),
    ).toBe("/(locker)");
  });

  it("routes completed onboarding without locker to QR", () => {
    expect(
      resolveInitialRoute({
        hasCompletedOnboarding: true,
        selectedLockerId: null,
      }),
    ).toBe("/qr");
  });

  it("treats invalid saved locker as missing locker for routing", () => {
    const normalized = normalizeEntryState({
      hasCompletedOnboarding: true,
      selectedLockerId: "not-a-locker",
    });
    expect(normalized.selectedLockerId).toBeNull();
    expect(resolveInitialRoute(normalized)).toBe("/qr");
  });
});

describe("onboarding completion", () => {
  it("persists the completed flag without requiring a locker", () => {
    expect(
      normalizeEntryState({
        hasCompletedOnboarding: true,
        selectedLockerId: null,
      }),
    ).toEqual({
      hasCompletedOnboarding: true,
      selectedLockerId: null,
    });
  });
});

describe("persistence serialization", () => {
  it("round-trips valid state", () => {
    const state = {
      hasCompletedOnboarding: true,
      selectedLockerId: DEFAULT_LOCKER_ID,
    };
    expect(parsePersistedEntryState(serializeEntryState(state))).toEqual(state);
  });

  it("recovers from corrupt JSON", () => {
    expect(parsePersistedEntryState("{not-json")).toEqual(emptyEntryState);
  });

  it("strips invalid locker on serialize", () => {
    const raw = serializeEntryState({
      hasCompletedOnboarding: true,
      selectedLockerId: "bogus",
    });
    expect(JSON.parse(raw).selectedLockerId).toBeNull();
  });
});

describe("mock QR resolution", () => {
  it("resolves the demo locker id", () => {
    expect(resolveMockQrScan()).toBe(DEFAULT_LOCKER_ID);
  });
});
