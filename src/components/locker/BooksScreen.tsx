import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DEFAULT_LOCKER_ID, getLocker } from "../../data/mock";
import { useLockerBooks } from "../../lib/demo-store";
import { colors, spacing } from "../../theme";
import { BookBrowser } from "../BookBrowser";
import { AppText } from "../ui/AppText";

export function BooksScreen() {
  const lockerId = DEFAULT_LOCKER_ID;
  const locker = getLocker(lockerId);
  const books = useLockerBooks(lockerId);

  if (!locker) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.centered}>
          <AppText variant="heading">Dolap bulunamadı</AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <BookBrowser
        books={books}
        listHeader={
          <View style={styles.header}>
            <AppText variant="title">Kitaplar</AppText>
            <AppText variant="body" muted style={styles.subtitle}>
              {locker.name}
            </AppText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});
