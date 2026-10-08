import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";

import { resolveInitialRoute } from "../src/lib/entry-state";
import { useEntryState } from "../src/lib/entry-state-context";
import { colors } from "../src/theme";

export default function Index() {
  const { isHydrated, entryState } = useEntryState();

  if (!isHydrated) {
    return <View style={styles.boot} />;
  }

  return <Redirect href={resolveInitialRoute(entryState)} />;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
