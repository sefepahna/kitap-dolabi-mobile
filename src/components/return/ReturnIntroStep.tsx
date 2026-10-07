// Return summary / confirmation before the locker simulation starts.
import { StyleSheet, View } from "react-native";

import { formatDate } from "../../data/mock";
import { formatDueMessage } from "../../lib/rentals-list";
import type { ReturnSummary } from "../../lib/return-flow";
import { colors, spacing } from "../../theme";
import type { Book } from "../../types";
import { BookCover } from "../BookCover";
import { StepLayout } from "../rental/StepLayout";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";

type ReturnIntroStepProps = {
  book: Book;
  summary: ReturnSummary;
  busy: boolean;
  onStart: () => void;
  onBack: () => void;
};

export function ReturnIntroStep({ book, summary, busy, onStart, onBack }: ReturnIntroStepProps) {
  const rows: [string, string][] = [
    ["Aldığın dolap", summary.originalLockerName],
    ["İade dolabı", summary.returnLockerName],
    ["Bölme", summary.slot],
    ["Kiralama tarihi", formatDate(summary.startDate)],
    ["Son iade", formatDate(summary.dueDate)],
  ];

  const footer = <Button label="Dolaptayım, devam et" loading={busy} onPress={onStart} />;

  return (
    <StepLayout onBack={onBack} backDisabled={busy} footer={footer}>
      <AppText variant="title">Kitabı iade et</AppText>

      <View style={styles.bookRow}>
        <BookCover book={book} />
        <View style={styles.bookInfo}>
          <AppText variant="heading" numberOfLines={3}>
            {book.title}
          </AppText>
          <AppText variant="body" muted>
            {book.author}
          </AppText>
          <AppText variant="bodyMedium" style={styles.due}>
            {formatDueMessage(summary.dueDate)}
          </AppText>
        </View>
      </View>

      <View style={styles.rows}>
        {rows.map(([label, value], index) => (
          <View key={label} style={[styles.row, index === rows.length - 1 && styles.rowLast]}>
            <AppText variant="body" muted style={styles.label}>
              {label}
            </AppText>
            <AppText variant="bodyMedium" style={styles.value}>
              {value}
            </AppText>
          </View>
        ))}
      </View>

      <AppText variant="body" style={styles.note}>
        Bu kitap yalnızca aldığın dolaba iade edilebilir.
      </AppText>
      <AppText variant="caption" muted>
        {summary.lockerLocation}
      </AppText>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  bookRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  bookInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  due: {
    marginTop: spacing.sm,
  },
  rows: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    flexShrink: 0,
  },
  value: {
    flex: 1,
    textAlign: "right",
  },
  note: {
    marginTop: spacing.md,
  },
});
