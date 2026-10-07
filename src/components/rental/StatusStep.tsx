// Centered progress state (paying / preparing). Shows a spinner, title and optional text.
import { ActivityIndicator, StyleSheet } from "react-native";

import { colors, spacing } from "../../theme";
import { AppText } from "../ui/AppText";
import { StepLayout } from "./StepLayout";

type StatusStepProps = {
  title: string;
  text?: string;
};

export function StatusStep({ title, text }: StatusStepProps) {
  return (
    <StepLayout centered>
      <ActivityIndicator color={colors.mutedForeground} size="large" />
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      {text ? (
        <AppText variant="body" muted style={styles.text}>
          {text}
        </AppText>
      ) : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    textAlign: "center",
  },
  text: {
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
