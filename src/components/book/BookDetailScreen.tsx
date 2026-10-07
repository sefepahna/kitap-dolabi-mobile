import { ChevronLeft } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { DEFAULT_LOCKER_ID, getLockerBook, rentalDays, returnDate } from "../../data/mock";
import { useDemoState, withStatus } from "../../lib/demo-store";
import { colors, fontSize, radius, spacing } from "../../theme";
import { BookCover } from "../BookCover";
import { metadataRowStyles } from "../ui/metadata-row-styles";
import { AppText } from "../ui/AppText";

const FOOTER_MIN_HEIGHT = 72;

export function BookDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const demoState = useDemoState();

  const baseBook = typeof bookId === "string" ? getLockerBook(DEFAULT_LOCKER_ID, bookId) : undefined;

  if (!baseBook) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.notFound}>
          <AppText variant="body" muted style={styles.notFoundText}>
            Bu kitap bu dolapta bulunmuyor.
          </AppText>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <AppText variant="bodyMedium">Geri dön</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const book = withStatus(baseBook, demoState);
  const days = rentalDays(book.pages);
  const metadataRows: [string, string][] = [
    ["Kategori", book.category],
    ["Sayfa", `${book.pages}`],
    ["Bölme", book.slot],
    ["Kira ücreti", `${book.fee} TL`],
    ["Kira süresi", `${days} gün`],
    ["İade tarihi", returnDate(days)],
  ];

  const footerPadding = Math.max(insets.bottom, spacing.md);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: FOOTER_MIN_HEIGHT + footerPadding + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <ChevronLeft color={colors.mutedForeground} size={16} strokeWidth={1.6} />
          <AppText variant="body" muted>
            Geri
          </AppText>
        </Pressable>

        <View style={styles.coverFrame}>
          <BookCover book={book} size="lg" />
        </View>

        <AppText variant="title" style={styles.title}>
          {book.title}
        </AppText>
        <AppText variant="body" muted>
          {book.author}
        </AppText>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, book.available ? styles.statusAvailable : styles.statusRented]} />
          <AppText variant="body">{book.available ? "Bu dolapta müsait" : "Şu anda kirada"}</AppText>
        </View>

        <AppText variant="body" style={styles.description}>
          {book.description}
        </AppText>

        <View style={[metadataRowStyles.block, styles.metadataBlock]}>
          {metadataRows.map(([label, value], index) => (
            <View
              key={label}
              style={[metadataRowStyles.row, index === metadataRows.length - 1 && metadataRowStyles.rowLast]}
            >
              <AppText variant="body" muted style={metadataRowStyles.label}>
                {label}
              </AppText>
              <AppText variant="bodyMedium" style={metadataRowStyles.value}>
                {value}
              </AppText>
            </View>
          ))}
        </View>

        <AppText variant="caption" muted style={styles.note}>
          Kitap yalnızca kiralandığı dolaba iade edilebilir.
        </AppText>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerPadding }]}>
        {book.available ? (
          <Pressable
            style={({ pressed }) => [styles.rentCta, pressed && styles.rentCtaPressed]}
            onPress={() => router.push({ pathname: "/book/[bookId]/kirala", params: { bookId: book.id } })}
          >
            <AppText variant="bodyMedium" color={colors.primaryForeground}>
              Kitabı Kirala
            </AppText>
            <AppText variant="bodyMedium" color={colors.primaryForeground}>
              {book.fee} TL
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.disabledCta}>
            <AppText variant="bodyMedium" muted>
              Şu anda kirada
            </AppText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    alignSelf: "flex-start",
    marginBottom: spacing.lg,
  },
  coverFrame: {
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    marginTop: spacing.lg,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusAvailable: {
    backgroundColor: colors.success,
  },
  statusRented: {
    backgroundColor: colors.mutedForeground,
  },
  description: {
    marginTop: spacing.lg,
    lineHeight: fontSize.md * 1.5,
  },
  metadataBlock: {
    marginTop: spacing.lg,
  },
  note: {
    marginTop: spacing.md,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  rentCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  rentCtaPressed: {
    opacity: 0.92,
  },
  disabledCta: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  notFoundText: {
    textAlign: "center",
  },
  backLink: {
    paddingVertical: spacing.sm,
  },
});
