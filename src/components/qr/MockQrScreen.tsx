import { useRouter } from "expo-router";
import { ScanLine } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getLocker } from "../../data/mock";
import { useEntryState } from "../../lib/entry-state-context";
import { useLockerBooks } from "../../lib/demo-store";
import { resolveMockQrScan } from "../../lib/mock-qr";
import { delay } from "../../lib/delay";
import { colors, radius, spacing } from "../../theme";
import { Button } from "../ui/Button";
import { AppText } from "../ui/AppText";

type QrPhase = "idle" | "scanning" | "found";

const SCAN_MS = 1400;

export function MockQrScreen() {
  const router = useRouter();
  const { setSelectedLockerId } = useEntryState();
  const [phase, setPhase] = useState<QrPhase>("idle");
  const [lockerId, setLockerId] = useState<string | null>(null);
  const scanToken = useRef(0);

  const locker = lockerId ? getLocker(lockerId) : null;
  const books = useLockerBooks(lockerId ?? "");
  const availableCount = books.filter((book) => book.available).length;

  const startScan = useCallback(async () => {
    const token = ++scanToken.current;
    setPhase("scanning");
    setLockerId(null);
    await delay(SCAN_MS);
    if (token !== scanToken.current) return;
    const resolved = resolveMockQrScan();
    setLockerId(resolved);
    setPhase(resolved ? "found" : "idle");
  }, []);

  useEffect(() => {
    return () => {
      scanToken.current += 1;
    };
  }, []);

  const goToLocker = async () => {
    if (!lockerId) return;
    await setSelectedLockerId(lockerId);
    router.replace("/(locker)");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.content}>
        {phase === "idle" && (
          <>
            <View style={styles.frame}>
              <View style={styles.frameInner}>
                <ScanLine color={colors.primary} size={48} strokeWidth={1.4} />
              </View>
            </View>
            <AppText variant="heading" style={styles.heading}>
              Dolap QR kodunu tara
            </AppText>
            <AppText variant="body" muted style={styles.copy}>
              Kampüsteki Kitap Dolabı üzerindeki QR kodu okutarak dolaba bağlan.
            </AppText>
            <Button label="Demo QR'ı Tara" onPress={startScan} />
          </>
        )}

        {phase === "scanning" && (
          <View style={styles.centerBlock}>
            <View style={styles.frame}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
            <AppText variant="bodyMedium">QR kodu okunuyor…</AppText>
          </View>
        )}

        {phase === "found" && locker && (
          <>
            <AppText variant="caption" muted style={styles.eyebrow}>
              Dolap bulundu
            </AppText>
            <AppText variant="title" style={styles.lockerName}>
              {locker.name}
            </AppText>
            <AppText variant="body" muted>
              {locker.location}
            </AppText>
            <View style={styles.statsRow}>
              <AppText variant="bodyMedium">{availableCount}</AppText>
              <AppText variant="body" muted>
                {" "}
                / {books.length} müsait
              </AppText>
            </View>
            <Button label="Dolaba Git" onPress={goToLocker} />
          </>
        )}
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
    gap: spacing.lg,
  },
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  frame: {
    alignSelf: "center",
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginVertical: spacing.xl,
  },
  frameInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  heading: {
    textAlign: "center",
  },
  copy: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  eyebrow: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  lockerName: {
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
});
