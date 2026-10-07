// Step 2 — 6-digit demo OTP, verified through authService.
import { StyleSheet, TextInput } from "react-native";

import { formatPhone, OTP_LENGTH } from "../../lib/rental-flow";
import { colors, fontFamily, fontSize, radius, spacing } from "../../theme";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";
import { StepLayout } from "./StepLayout";

type OtpStepProps = {
  phone: string;
  otp: string;
  error: string | null;
  busy: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function OtpStep({ phone, otp, error, busy, onChange, onSubmit, onBack }: OtpStepProps) {
  const footer = (
    <Button
      label={busy ? "Doğrulanıyor" : "Doğrula"}
      loading={busy}
      disabled={otp.length !== OTP_LENGTH}
      onPress={onSubmit}
    />
  );

  return (
    <StepLayout onBack={onBack} backDisabled={busy} footer={footer}>
      <AppText variant="title">Doğrulama kodunu gir</AppText>
      <AppText variant="body" muted style={styles.hint}>
        +90 {formatPhone(phone)} numarasına gönderilen 6 haneli kod.
      </AppText>

      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={onChange}
        placeholder="••••••"
        placeholderTextColor={colors.mutedForeground}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={OTP_LENGTH}
        autoFocus
        accessibilityLabel="Doğrulama kodu"
      />
      {error ? (
        <AppText variant="body" color={colors.destructive} style={styles.message}>
          {error}
        </AppText>
      ) : null}
      <AppText variant="caption" muted style={styles.message}>
        Demo kodu: 123456
      </AppText>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: spacing.xs,
  },
  input: {
    marginTop: spacing.xl,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    textAlign: "center",
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.xxl,
    letterSpacing: 8,
    color: colors.foreground,
  },
  message: {
    marginTop: spacing.sm,
  },
});
