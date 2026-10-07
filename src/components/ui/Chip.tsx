import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { colors, fontFamily, fontSize, radius, spacing } from "../../theme";
import { AppText } from "./AppText";

type ChipProps = Omit<PressableProps, "children"> & {
  label: string;
  selected?: boolean;
};

export function Chip({ label, selected = false, style, ...props }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) =>
        [styles.base, selected && styles.selected, pressed && styles.pressed, style] as StyleProp<ViewStyle>
      }
      {...props}
    >
      <AppText
        variant="label"
        color={selected ? colors.foreground : colors.mutedForeground}
        style={styles.label}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selected: {
    borderColor: colors.foreground,
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
  },
});
