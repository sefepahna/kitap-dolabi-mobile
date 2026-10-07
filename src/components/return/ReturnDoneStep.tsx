// Final return step — the only action replaces the flow with Kiralamalarım.
import { Check } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "../../theme";
import { StepLayout } from "../rental/StepLayout";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";

type ReturnDoneStepProps = {
  title: string;
  onGoToRentals: () => void;
};

const CHECK_SIZE = 24;
const BADGE_SIZE = 48;

export function ReturnDoneStep({ title, onGoToRentals }: ReturnDoneStepProps) {
  return (
    <StepLayout centered footer={<Button label="Kiralamalarıma Dön" onPress={onGoToRentals} />}>
      <View style={styles.badge}>
        <Check color={colors.success} size={CHECK_SIZE} />
      </View>
      <AppText variant="title" style={styles.title}>
        İade tamamlandı
      </AppText>
      <AppText variant="body" muted style={styles.text}>
        <AppText variant="bodyMedium">{title}</AppText> başarıyla iade edildi.
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
});
