// Final step — confirms the rental; navigation replaces the whole flow stack.
import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { formatDate } from "../../data/mock";
import { colors, spacing } from "../../theme";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";
import { StepLayout } from "./StepLayout";

type DoneStepProps = {
  title: string;
  dueDate: Date | string;
  onGoToRentals: () => void;
  onGoToLocker: () => void;
};

const CHECK_SIZE = 24;
const BADGE_SIZE = 48;

export function DoneStep({ title, dueDate, onGoToRentals, onGoToLocker }: DoneStepProps) {
  const footer = (
    <>
      <Button label="Kiralamalarıma Git" onPress={onGoToRentals} />
      <Pressable onPress={onGoToLocker} style={styles.secondary} accessibilityRole="button">
        <AppText variant="body" muted>
          Dolaba dön
        </AppText>
      </Pressable>
    </>
  );

  return (
    <StepLayout centered footer={footer}>
      <View style={styles.badge}>
        <Check color={colors.success} size={CHECK_SIZE} />
      </View>
      <AppText variant="title" style={styles.title}>
        Kiralama başladı
      </AppText>
      <AppText variant="body" muted style={styles.text}>
        <AppText variant="bodyMedium">{title}</AppText> artık sende. Son iade tarihi {formatDate(dueDate)}.
      </AppText>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.muted,
  },
  title: {
    marginTop: spacing.lg,
    textAlign: "center",
  },
  text: {
    marginTop: spacing.sm,
    textAlign: "center",
  },
  secondary: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
});
