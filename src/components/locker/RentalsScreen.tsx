import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { books, formatDate, getLocker } from "../../data/mock";
import { useDemoState } from "../../lib/demo-store";
import {
  formatDueMessage,
  getActiveRentalsFromState,
  getRentalHistoryFromState,
  getReturnRoute,
} from "../../lib/rentals-list";
import { colors, fontSize, spacing } from "../../theme";
import { BookCover } from "../BookCover";
import { AppText } from "../ui/AppText";

export function RentalsScreen() {
  const router = useRouter();
  const state = useDemoState();
  const activeRentals = getActiveRentalsFromState(state);
  const history = getRentalHistoryFromState(state);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="title">Kiralamalarım</AppText>

        <AppText variant="caption" muted style={styles.sectionLabel}>
          Aktif
        </AppText>

        {activeRentals.length === 0 ? (
          <AppText variant="body" muted style={styles.activeEmpty}>
            Şu anda aktif kiralaman yok.
          </AppText>
        ) : (
          <View style={styles.sectionList}>
            {activeRentals.map((rental) => {
              const book = books.find((item) => item.id === rental.bookId);
              if (!book) return null;

              return (
                <View key={rental.id} style={styles.activeRow}>
                  <BookCover book={book} />
                  <View style={styles.rowBody}>
                    <AppText variant="heading" style={styles.rowTitle} numberOfLines={2}>
                      {book.title}
                    </AppText>
                    <AppText variant="body" muted numberOfLines={1}>
                      {book.author}
                    </AppText>
                    <AppText variant="bodyMedium" style={styles.dueMessage}>
                      {formatDueMessage(rental.dueDate)}
                    </AppText>
                    <AppText variant="caption" muted>
                      Son iade {formatDate(rental.dueDate)} · Kirada
                    </AppText>
                    <AppText variant="caption" muted numberOfLines={1}>
                      {getLocker(rental.lockerId)?.name}
                    </AppText>
                    <Pressable
                      style={({ pressed }) => [styles.returnButton, pressed && styles.returnButtonPressed]}
                      onPress={() => router.push(getReturnRoute(rental.id))}
                    >
                      <AppText variant="bodyMedium">İade Et</AppText>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <AppText variant="caption" muted style={styles.historyLabel}>
          Geçmiş Kiralamalar
        </AppText>

        <View style={styles.sectionList}>
          {history.map((entry) => {
            const book = books.find((item) => item.id === entry.bookId);
            if (!book) return null;

            return (
              <View key={entry.id} style={styles.historyRow}>
                <BookCover book={book} />
                <View style={styles.rowBody}>
                  <AppText variant="heading" style={styles.rowTitle} numberOfLines={2}>
                    {book.title}
                  </AppText>
                  <AppText variant="body" muted numberOfLines={1}>
                    {book.author}
                  </AppText>
                  <AppText variant="caption" muted style={styles.historyMeta}>
                    İade edildi · {formatDate(entry.returnDate)}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    marginTop: spacing.xl,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  activeEmpty: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
  sectionList: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  activeRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.md,
    opacity: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: fontSize.lg,
  },
  dueMessage: {
    marginTop: spacing.sm,
  },
  returnButton: {
    alignSelf: "flex-start",
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  returnButtonPressed: {
    opacity: 0.85,
  },
  historyLabel: {
    marginTop: spacing.xl,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  historyMeta: {
    marginTop: "auto",
    paddingTop: spacing.sm,
  },
});
