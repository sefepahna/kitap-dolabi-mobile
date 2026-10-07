// Step 3 — rental summary built from domain data (no card entry, simulated payment method).
import { StyleSheet, View } from "react-native";

import { formatDate } from "../../data/mock";
import type { RentalSummary } from "../../lib/rental-flow";
import { colors, spacing } from "../../theme";
import type { LockerBook } from "../../types";
import { BookCover } from "../BookCover";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";
import { StepLayout } from "./StepLayout";

type SummaryStepProps = {
  book: LockerBook;
  summary: RentalSummary;
  error: string | null;
  busy: boolean;
  onPay: () => void;
  onBack: () => void;
};

export function SummaryStep({ book, summary, error, busy, onPay, onBack }: SummaryStepProps) {
  const rows: [string, string][] = [
    ["Teslim alma", summary.lockerName],
    ["Bölme", summary.slot],
    ["Kiralama süresi", `${summary.days} gün`],
    ["Son iade", formatDate(summary.returnOn)],
    ["Kiralama ücreti", `${summary.fee} TL`],
    ["Ödeme yöntemi", summary.paymentLabel],
  ];

  const footer = (
    <Button label={`${summary.fee} TL Öde ve Kirala`} loading={busy} disabled={busy} onPress={onPay} />
  );

  return (
    <StepLayout onBack={onBack} backDisabled={busy} footer={footer}>
      <AppText variant="title">Kiralama Özeti</AppText>

      <View style={styles.bookRow}>
        <BookCover book={book} />
        <View style={styles.bookInfo}>
          <AppText variant="heading" numberOfLines={3}>
            {book.title}
          </AppText>
          <AppText variant="body" muted>
            {book.author}
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

      <AppText variant="caption" muted style={styles.note}>
        Kitap yalnızca aldığın dolaba iade edilebilir.
      </AppText>
      {error ? (
        <AppText variant="body" color={colors.destructive} style={styles.note}>
          {error}
        </AppText>
      ) : null}
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
