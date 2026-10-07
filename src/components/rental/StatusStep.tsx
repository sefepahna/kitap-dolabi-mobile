// Centered progress state (paying / preparing). Shows a spinner, title and optional text.
import { Check } from "lucide-react-native";
import { ActivityIndicator, StyleSheet } from "react-native";

import { colors, spacing } from "../../theme";
import { AppText } from "../ui/AppText";
import { StepLayout } from "./StepLayout";

type StatusStepProps = {
  title: string;
  text?: string;
  done?: boolean;
};

const CHECK_SIZE = 32;

export function StatusStep({ title, text, done = false }: StatusStepProps) {
  return (
    <StepLayout centered>
      {done ? (
        <Check color={colors.success} size={CHECK_SIZE} />
      ) : (
        <ActivityIndicator color={colors.mutedForeground} size="large" />
      )}
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
