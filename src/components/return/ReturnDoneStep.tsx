// Final return step — the only action replaces the flow with Kiralamalarım.
import { Check } from "lucide-react-native";
import { View } from "react-native";

import { colors } from "../../theme";
import { DONE_CHECK_SIZE, doneStepStyles } from "../rental/done-step-styles";
import { StepLayout } from "../rental/StepLayout";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";

type ReturnDoneStepProps = {
  title: string;
  onGoToRentals: () => void;
};

export function ReturnDoneStep({ title, onGoToRentals }: ReturnDoneStepProps) {
  return (
    <StepLayout centered footer={<Button label="Kiralamalarıma Dön" onPress={onGoToRentals} />}>
      <View style={doneStepStyles.badge}>
        <Check color={colors.success} size={DONE_CHECK_SIZE} />
      </View>
      <AppText variant="title" style={doneStepStyles.title}>
        İade tamamlandı
      </AppText>
      <AppText variant="body" muted style={doneStepStyles.text}>
        <AppText variant="bodyMedium">{title}</AppText> başarıyla iade edildi.
      </AppText>
    </StepLayout>
  );
}
