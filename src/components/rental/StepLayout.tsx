// Shared frame for every rental step: safe area, optional back, single scroll area, pinned footer.
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "../../theme";
import { AppText } from "../ui/AppText";

type StepLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  backDisabled?: boolean;
  /** Vertically centers step content (completion / notice screens). */
  centered?: boolean;
  /** Centers status + compartment groups with slightly lower optical balance. */
  balanceContent?: boolean;
};

const BACK_ICON_SIZE = 16;
const HEADER_HEIGHT = 24;

export function StepLayout({
  children,
  footer,
  onBack,
  backDisabled = false,
  centered = false,
  balanceContent = false,
}: StepLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              disabled={backDisabled}
              hitSlop={8}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel="Geri"
              accessibilityState={{ disabled: backDisabled }}
            >
              <ChevronLeft color={colors.mutedForeground} size={BACK_ICON_SIZE} strokeWidth={1.6} />
              <AppText variant="body" muted>
                Geri
              </AppText>
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            centered && styles.centered,
            balanceContent && styles.balanceContent,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {footer ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>{footer}</View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    minHeight: HEADER_HEIGHT,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    alignSelf: "flex-start",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  balanceContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
});
