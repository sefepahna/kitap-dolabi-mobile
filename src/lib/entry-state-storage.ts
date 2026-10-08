import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ENTRY_STATE_STORAGE_KEY,
  emptyEntryState,
  parsePersistedEntryState,
  serializeEntryState,
  type PersistedEntryState,
} from "./entry-state";

export type EntryStateStorage = {
  read: () => Promise<PersistedEntryState>;
  write: (state: PersistedEntryState) => Promise<void>;
};

export const defaultEntryStateStorage: EntryStateStorage = {
  async read() {
    try {
      const raw = await AsyncStorage.getItem(ENTRY_STATE_STORAGE_KEY);
      return parsePersistedEntryState(raw);
    } catch {
      return emptyEntryState;
    }
  },
  async write(state) {
    try {
      await AsyncStorage.setItem(ENTRY_STATE_STORAGE_KEY, serializeEntryState(state));
    } catch {
      // Demo persistence: ignore write failures without crashing.
    }
  },
};
