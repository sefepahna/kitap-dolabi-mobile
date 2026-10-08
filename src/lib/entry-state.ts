import { getLocker } from "../data/mock";

export const ENTRY_STATE_STORAGE_KEY = "kitap-dolabi.entry-state.v1";

export type PersistedEntryState = {
  hasCompletedOnboarding: boolean;
  selectedLockerId: string | null;
};

export const emptyEntryState: PersistedEntryState = {
  hasCompletedOnboarding: false,
  selectedLockerId: null,
};

export type EntryRoute = "/onboarding" | "/qr" | "/(locker)";

export function validateLockerId(lockerId: string | null | undefined): string | null {
  if (!lockerId) return null;
  return getLocker(lockerId) ? lockerId : null;
}

export function parsePersistedEntryState(raw: string | null): PersistedEntryState {
  if (!raw) return emptyEntryState;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedEntryState>;
    return normalizeEntryState(parsed);
  } catch {
    return emptyEntryState;
  }
}

export function normalizeEntryState(value: Partial<PersistedEntryState> | null | undefined): PersistedEntryState {
  if (!value || typeof value !== "object") return emptyEntryState;
  return {
    hasCompletedOnboarding: value.hasCompletedOnboarding === true,
    selectedLockerId: validateLockerId(value.selectedLockerId ?? null),
  };
}

export function serializeEntryState(state: PersistedEntryState): string {
  return JSON.stringify({
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    selectedLockerId: validateLockerId(state.selectedLockerId),
  });
}

export function resolveInitialRoute(state: PersistedEntryState): EntryRoute {
  if (!state.hasCompletedOnboarding) return "/onboarding";
  if (state.selectedLockerId) return "/(locker)";
  return "/qr";
}
