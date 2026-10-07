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
      <Button label={confirmLabel} disabled={busy} onPress={onConfirm} />
    ) : undefined;

  return (
    <StepLayout footer={footer}>
      <View style={styles.body}>
        <CompartmentGrid slots={slots} activeSlot={slot} open={phase === "opened"} />

        {phase === "opened" ? (
          <>
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
          </>
        ) : null}

        {phase === "verifying" ? (
          <>
            <ActivityIndicator color={colors.mutedForeground} style={styles.indicator} />
            <AppText variant="title" style={styles.heading}>
              Kitap doğrulanıyor
            </AppText>
          </>
        ) : null}

        {phase === "verified" ? (
          <>
            <Check color={colors.success} size={CHECK_SIZE} style={styles.indicator} />
            <AppText variant="title" style={styles.heading}>
              RFID doğrulandı
            </AppText>
          </>
        ) : null}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: spacing.xl,
  },
  opened: {
    marginTop: spacing.xxl,
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
    marginTop: spacing.xl,
  },
  heading: {
    marginTop: spacing.md,
    textAlign: "center",
  },
});
