import { StyleSheet, Text, type TextProps, type TextStyle } from "react-native";

import { colors, fontFamily, fontSize, lineHeight } from "../../theme";

type AppTextVariant = "body" | "bodyMedium" | "label" | "caption" | "title" | "heading";

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  muted?: boolean;
  color?: string;
};

const variantStyles: Record<AppTextVariant, TextStyle> = {
  body: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  bodyMedium: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: 0.2,
  },
  caption: {
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
  title: {
    fontFamily: fontFamily.serifRegular,
    fontSize: fontSize.xxl,
    lineHeight: fontSize.xxl * lineHeight.tight,
  },
  heading: {
    fontFamily: fontFamily.serifMedium,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.snug,
  },
};

export function AppText({
  variant = "body",
  muted = false,
  color,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        variantStyles[variant],
        { color: color ?? (muted ? colors.mutedForeground : colors.foreground) },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.foreground,
  },
});
