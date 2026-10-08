import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { emptyEntryState, type PersistedEntryState } from "./entry-state";
import { defaultEntryStateStorage, type EntryStateStorage } from "./entry-state-storage";

type EntryStateContextValue = {
  isHydrated: boolean;
  entryState: PersistedEntryState;
  completeOnboarding: () => Promise<void>;
  setSelectedLockerId: (lockerId: string) => Promise<void>;
  resetEntryState: () => Promise<void>;
};

const EntryStateContext = createContext<EntryStateContextValue | null>(null);

type EntryStateProviderProps = {
  children: ReactNode;
  storage?: EntryStateStorage;
};

export function EntryStateProvider({ children, storage = defaultEntryStateStorage }: EntryStateProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [entryState, setEntryState] = useState<PersistedEntryState>(emptyEntryState);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await storage.read();
      if (!cancelled) {
        setEntryState(loaded);
        setIsHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storage]);

  const persist = useCallback(
    async (updater: (prev: PersistedEntryState) => PersistedEntryState) => {
      let next = emptyEntryState;
      setEntryState((prev) => {
        next = updater(prev);
        return next;
      });
      await storage.write(next);
    },
    [storage],
  );

  const completeOnboarding = useCallback(async () => {
    await persist((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  }, [persist]);

  const setSelectedLockerId = useCallback(
    async (lockerId: string) => {
      await persist((prev) => ({ ...prev, selectedLockerId: lockerId }));
    },
    [persist],
  );

  const resetEntryState = useCallback(async () => {
    setEntryState(emptyEntryState);
    await storage.write(emptyEntryState);
  }, [storage]);

  const value = useMemo(
    () => ({
      isHydrated,
      entryState,
      completeOnboarding,
      setSelectedLockerId,
      resetEntryState,
    }),
    [isHydrated, entryState, completeOnboarding, setSelectedLockerId, resetEntryState],
  );

  return <EntryStateContext.Provider value={value}>{children}</EntryStateContext.Provider>;
}

export function useEntryState(): EntryStateContextValue {
  const context = useContext(EntryStateContext);
  if (!context) {
    throw new Error("useEntryState must be used within EntryStateProvider");
  }
  return context;
}
