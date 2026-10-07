// Step 1 — Turkish mobile number (+90 5XX XXX XX XX).
import { StyleSheet, TextInput, View } from "react-native";

import { formatPhone, isValidPhone, PHONE_LENGTH } from "../../lib/rental-flow";
import { colors, fontFamily, fontSize, radius, spacing } from "../../theme";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";
import { StepLayout } from "./StepLayout";

type PhoneStepProps = {
  phone: string;
  error: string | null;
  busy: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function PhoneStep({ phone, error, busy, onChange, onSubmit, onBack }: PhoneStepProps) {
  const footer = (
    <Button
      label={busy ? "Kod gönderiliyor" : "Devam Et"}
      loading={busy}
      disabled={phone.length < PHONE_LENGTH}
      onPress={onSubmit}
    />
  );

  return (
    <StepLayout onBack={onBack} backDisabled={busy} footer={footer}>
      <AppText variant="title">Telefon numaranı gir</AppText>
      <AppText variant="body" muted style={styles.hint}>
        Kiralamaya devam etmek için numarana bir doğrulama kodu göndereceğiz.
      </AppText>

      <View style={styles.field}>
        <AppText variant="body" muted>
          +90
        </AppText>
        <TextInput
          style={styles.input}
          value={formatPhone(phone)}
          onChangeText={onChange}
          placeholder="5XX XXX XX XX"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="number-pad"
          textContentType="telephoneNumber"
          autoComplete="tel-national"
          autoFocus
          editable={!busy}
          returnKeyType="done"
          onSubmitEditing={() => isValidPhone(phone) && onSubmit()}
          accessibilityLabel="Telefon numarası"
        />
      </View>
      {error ? (
        <AppText variant="body" color={colors.destructive} style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: spacing.xs,
  },
  field: {
    marginTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    minHeight: 48,
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.lg,
    letterSpacing: 0.5,
    color: colors.foreground,
  },
  error: {
    marginTop: spacing.sm,
  },
});
