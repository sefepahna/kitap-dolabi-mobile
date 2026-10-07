import { StyleSheet } from "react-native";

import { colors, spacing } from "../../theme";

/** Shared label/value rows for summary and detail screens. */
export const metadataRowStyles = StyleSheet.create({
  block: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    flexShrink: 0,
    maxWidth: "44%",
  },
  value: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    textAlign: "right",
  },
});
