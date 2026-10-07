import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type ViewStyle } from "react-native";

import { colors, fontFamily, fontSize, radius, spacing } from "../../theme";
import { AppText } from "./AppText";

type ButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  label,
  loading = false,
  disabled,
  fullWidth = true,
  style,
  accessibilityLabel,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryForeground} />
      ) : (
        <AppText variant="bodyMedium" color={colors.primaryForeground} style={styles.label}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
  },
});
