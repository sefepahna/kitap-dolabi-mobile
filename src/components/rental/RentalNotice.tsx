// Full-screen notice for guard / failure states (missing book, already rented, flow failure).
import { StyleSheet } from "react-native";

import { spacing } from "../../theme";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";
import { StepLayout } from "./StepLayout";

type RentalNoticeProps = {
  title: string;
  text?: string;
  actionLabel: string;
  onAction: () => void;
};

export function RentalNotice({ title, text, actionLabel, onAction }: RentalNoticeProps) {
  return (
    <StepLayout centered footer={<Button label={actionLabel} onPress={onAction} />}>
      <AppText variant="title" style={styles.text}>
        {title}
      </AppText>
      {text ? (
        <AppText variant="body" muted style={[styles.text, styles.subtitle]}>
          {text}
        </AppText>
      ) : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing.sm,
  },
});
