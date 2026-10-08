import { useRouter } from "expo-router";
import { BookOpen, QrCode, RefreshCw } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEntryState } from "../../lib/entry-state-context";
import { colors, spacing } from "../../theme";
import { Button } from "../ui/Button";
import { AppText } from "../ui/AppText";

const STEPS = [
  {
    title: "Kitapları keşfet",
    body: "Üniversitendeki Kitap Dolabı'ndan İş Kültür kitaplarına kolayca ulaş.",
    Icon: BookOpen,
  },
  {
    title: "Tara ve kirala",
    body: "Dolaptaki QR kodunu tara, kitabını seç ve İş Bankası kartınla kirala.",
    Icon: QrCode,
  },
  {
    title: "Oku ve iade et",
    body: "Kitabını bölmeden al, süresi içinde aynı dolaba iade et.",
    Icon: RefreshCw,
  },
] as const;

type OnboardingScreenProps = {
  replay?: boolean;
};

export function OnboardingScreen({ replay = false }: OnboardingScreenProps) {
  const router = useRouter();
  const { completeOnboarding } = useEntryState();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const onPrimary = async () => {
    if (replay && isLast) {
      router.back();
      return;
    }
    if (!replay && isLast) {
      await completeOnboarding();
      router.replace("/qr");
      return;
    }
    setStepIndex((index) => index + 1);
  };

  const primaryLabel = isLast ? (replay ? "Kapat" : "Dolap Bul") : "İleri";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.progressRow}>
          {STEPS.map((_, index) => (
            <View
              key={index}
              style={[styles.progressDot, index <= stepIndex ? styles.progressDotActive : styles.progressDotInactive]}
            />
          ))}
        </View>

        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <step.Icon color={colors.primary} size={32} strokeWidth={1.6} />
          </View>
          <AppText variant="title" style={styles.title}>
            {step.title}
          </AppText>
          <AppText variant="body" muted style={styles.body}>
            {step.body}
          </AppText>
        </View>

        <Button label={primaryLabel} onPress={onPrimary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    justifyContent: "space-between",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  progressDot: {
    height: 4,
    width: 40,
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressDotInactive: {
    backgroundColor: colors.border,
  },
  hero: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    marginTop: spacing.sm,
  },
  body: {
    maxWidth: 320,
  },
});
