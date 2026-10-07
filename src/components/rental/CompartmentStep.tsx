// Steps opened / verifying / verified — compartment map plus the state-specific message.
import { Check } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors, fontSize, spacing } from "../../theme";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";
import { CompartmentGrid } from "./CompartmentGrid";
import { StepLayout } from "./StepLayout";

type CompartmentStepProps = {
  phase: "opened" | "verifying" | "verified";
  slot: string;
  slots: string[];
  busy: boolean;
  openedHint: string;
  confirmLabel: string;
  onConfirm: () => void;
};

const CHECK_SIZE = 24;
const SLOT_FONT_SIZE = 48;

export function CompartmentStep({ phase, slot, slots, busy, openedHint, confirmLabel, onConfirm }: CompartmentStepProps) {
  const footer =
    phase === "opened" ? (
      <Button label={confirmLabel} loading={busy} disabled={busy} onPress={onConfirm} />
    ) : undefined;

  return (
    <StepLayout footer={footer} balanceContent>
      <View style={styles.group}>
        <CompartmentGrid slots={slots} activeSlot={slot} open={phase === "opened"} />

        {phase === "opened" ? (
          <View style={styles.statusBlock}>
            <View style={styles.opened} accessibilityRole="header">
              <AppText variant="caption" muted style={styles.eyebrow}>
                Bölme
              </AppText>
              <AppText variant="title" style={styles.slot}>
                {slot}
              </AppText>
              <AppText variant="heading">açıldı</AppText>
            </View>
            <AppText variant="body" muted style={styles.hint}>
              {openedHint}
            </AppText>
          </View>
        ) : null}

        {phase === "verifying" ? (
          <View style={styles.statusBlock}>
            <ActivityIndicator color={colors.mutedForeground} style={styles.indicator} />
            <AppText variant="title" style={styles.heading}>
              Kitap doğrulanıyor
            </AppText>
          </View>
        ) : null}

        {phase === "verified" ? (
          <View style={styles.statusBlock}>
            <Check color={colors.success} size={CHECK_SIZE} style={styles.indicator} />
            <AppText variant="title" style={styles.heading}>
              RFID doğrulandı
            </AppText>
          </View>
        ) : null}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  group: {
    width: "100%",
    alignItems: "center",
  },
  statusBlock: {
    width: "100%",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  opened: {
    alignItems: "center",
  },
  eyebrow: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  slot: {
    marginTop: spacing.xs,
    fontSize: SLOT_FONT_SIZE,
    lineHeight: SLOT_FONT_SIZE,
    paddingTop: spacing.xs,
  },
  hint: {
    marginTop: spacing.sm,
    textAlign: "center",
    fontSize: fontSize.md,
  },
  indicator: {
    marginTop: spacing.xs,
  },
  heading: {
    marginTop: spacing.md,
    textAlign: "center",
  },
});
