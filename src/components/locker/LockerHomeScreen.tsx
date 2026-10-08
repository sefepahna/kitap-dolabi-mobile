import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { MapPin } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DEFAULT_LOCKER_ID, getLocker } from "../../data/mock";
import { useLockerBooks } from "../../lib/demo-store";
import { useEntryState } from "../../lib/entry-state-context";
import { colors, spacing } from "../../theme";
import { BookBrowser } from "../BookBrowser";
import { AppText } from "../ui/AppText";

export function LockerHomeScreen() {
  const router = useRouter();
  const { resetEntryState } = useEntryState();
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

  const availableCount = books.filter((book) => book.available).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <BookBrowser
        books={books}
        listHeader={
          <View style={styles.header}>
            <AppText variant="caption" muted style={styles.eyebrow}>
              QR ile bağlandınız · Dolap
            </AppText>
            <AppText variant="title" style={styles.lockerName}>
              {locker.name}
            </AppText>
            <View style={styles.locationRow}>
              <MapPin color={colors.mutedForeground} size={14} strokeWidth={1.6} />
              <AppText variant="body" muted>
                {locker.location}
              </AppText>
            </View>
            <View style={styles.statsRow}>
              <AppText variant="bodyMedium">{availableCount}</AppText>
              <AppText variant="body" muted>
                {" "}
                / {books.length} müsait
              </AppText>
            </View>
            <View style={styles.linkRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/onboarding?replay=1")}
                onLongPress={
                  __DEV__
                    ? async () => {
                        await resetEntryState();
                        router.replace("/onboarding");
                      }
                    : undefined
                }
                delayLongPress={700}
                style={({ pressed }) => [styles.linkButton, pressed && styles.linkPressed]}
              >
                <AppText variant="body" muted style={styles.linkText}>
                  Nasıl çalışır?
                </AppText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/qr")}
                style={({ pressed }) => [styles.linkButton, pressed && styles.linkPressed]}
              >
                <AppText variant="body" muted style={styles.linkText}>
                  Dolabı yeniden tara
                </AppText>
              </Pressable>
            </View>
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
  eyebrow: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  lockerName: {
    marginTop: spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  linkButton: {
    paddingVertical: spacing.xs,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
