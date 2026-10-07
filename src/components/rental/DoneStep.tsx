// Final step — confirms the rental; navigation replaces the whole flow stack.
import { Check } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { formatDate } from "../../data/mock";
import { colors } from "../../theme";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";
import { DONE_CHECK_SIZE, doneStepStyles } from "./done-step-styles";
import { StepLayout } from "./StepLayout";

type DoneStepProps = {
  title: string;
  dueDate: Date | string;
  onGoToRentals: () => void;
  onGoToLocker: () => void;
};

export function DoneStep({ title, dueDate, onGoToRentals, onGoToLocker }: DoneStepProps) {
  const footer = (
    <>
      <Button label="Kiralamalarıma Git" onPress={onGoToRentals} />
      <Pressable
        onPress={onGoToLocker}
        style={doneStepStyles.secondaryAction}
        accessibilityRole="button"
        accessibilityLabel="Dolaba dön"
      >
        <AppText variant="body" muted>
          Dolaba dön
        </AppText>
      </Pressable>
    </>
  );

  return (
    <StepLayout centered footer={footer}>
      <View style={doneStepStyles.badge}>
        <Check color={colors.success} size={DONE_CHECK_SIZE} />
      </View>
      <AppText variant="title" style={doneStepStyles.title}>
        Kiralama başladı
      </AppText>
      <AppText variant="body" muted style={doneStepStyles.text}>
        <AppText variant="bodyMedium">{title}</AppText> artık sende. Son iade tarihi {formatDate(dueDate)}.
      </AppText>
    </StepLayout>
  );
}
