import { StyleSheet } from "react-native";

import { colors, spacing } from "../../theme";

export const DONE_BADGE_SIZE = 48;
export const DONE_CHECK_SIZE = 24;

export const doneStepStyles = StyleSheet.create({
  badge: {
    width: DONE_BADGE_SIZE,
    height: DONE_BADGE_SIZE,
    borderRadius: DONE_BADGE_SIZE / 2,
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
  secondaryAction: {
    alignItems: "center",
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: "center",
  },
});
