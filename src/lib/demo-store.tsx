// Local demo state (rentals + copy availability), in memory only.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { getLockerBooks, type LockerBook } from "../data/mock";
import type { DemoState, Rental } from "../types";

export type { Rental };

const initialState: DemoState = { copyStatus: {}, rentals: [] };

type DemoStoreHandle = {
  getState: () => DemoState;
  setState: (fn: (state: DemoState) => DemoState) => void;
  subscribe: (listener: () => void) => () => void;
};

function createDemoStore(): DemoStoreHandle {
  let state = initialState;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (fn) => {
      state = fn(state);
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const standaloneStore = createDemoStore();
let activeStore: DemoStoreHandle = standaloneStore;

const DemoStoreContext = createContext<DemoStoreHandle | null>(null);

export function getState(): DemoState {
  return activeStore.getState();
}

export function setState(fn: (state: DemoState) => DemoState) {
  activeStore.setState(fn);
}

/** Resets in-memory demo state (tests only). */
export function resetDemoStore() {
  setState(() => initialState);
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<DemoStoreHandle | null>(null);
  if (!storeRef.current) {
    storeRef.current = createDemoStore();
  }

  const store = storeRef.current;

  useEffect(() => {
    activeStore = store;
    return () => {
      activeStore = standaloneStore;
    };
  }, [store]);

  const value = useMemo(() => store, [store]);

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

function useStoreHandle(): DemoStoreHandle {
  const context = useContext(DemoStoreContext);
  return context ?? standaloneStore;
}

export function useDemoState(): DemoState {
  const { subscribe, getState: readState } = useStoreHandle();
  return useSyncExternalStore(subscribe, readState, () => initialState);
}

/** Mobile demo store is ready immediately (no web hydration/localStorage). */
export function useStoreReady(): boolean {
  useDemoState();
  return true;
}

export function withStatus(book: LockerBook, state: DemoState): LockerBook {
  const override = state.copyStatus[book.copyId];
  return override === undefined ? book : { ...book, available: override };
}

export function applyStatus(books: LockerBook[], state: DemoState): LockerBook[] {
  return books.map((book) => withStatus(book, state));
}

export function useLockerBooks(lockerId: string): LockerBook[] {
  const state = useDemoState();
  return applyStatus(getLockerBooks(lockerId), state);
}

export function getActiveRentals(state: DemoState = getState()): Rental[] {
  return state.rentals.filter((rental) => rental.status === "active");
}
