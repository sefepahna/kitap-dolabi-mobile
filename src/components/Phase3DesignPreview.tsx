import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { coverColors, colors, radius, spacing } from "../theme";
import { AppText } from "./ui/AppText";
import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";

const DEMO_CATEGORIES = ["Tümü", "Roman", "Bilim", "Felsefe"] as const;

type Phase3DesignPreviewProps = {
  tabLabel: string;
};

/** Temporary Phase 3 visual check — remove or replace in Phase 5. */
export function Phase3DesignPreview({ tabLabel }: Phase3DesignPreviewProps) {
  const [category, setCategory] = useState<(typeof DEMO_CATEGORIES)[number]>("Tümü");
  const [loadingDemo, setLoadingDemo] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="caption" muted style={styles.eyebrow}>
          Faz 3 önizleme · {tabLabel}
        </AppText>
        <AppText variant="title">Kitap Dolabı</AppText>
        <AppText variant="body" muted style={styles.lead}>
          Instrument Sans gövde metni ve Newsreader başlık örneği.
        </AppText>

        <View style={styles.chipRow}>
          {DEMO_CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>

        <View style={styles.coverRow}>
          {([1, 2, 3, 4, 5, 6] as const).map((id) => (
            <View key={id} style={[styles.coverSwatch, { backgroundColor: coverColors[id] }]}>
              <AppText variant="caption" color={coverColors.ink}>
                {id}
              </AppText>
            </View>
          ))}
        </View>

        <Button
          label="Birincil düğme"
          onPress={() => {
            setLoadingDemo(true);
            setTimeout(() => setLoadingDemo(false), 1200);
          }}
          loading={loadingDemo}
        />
        <Button label="Devre dışı düğme" disabled style={styles.disabledButton} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  lead: {
    marginTop: spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  coverRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  coverSwatch: {
    width: 44,
    height: 66,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    marginTop: spacing.sm,
  },
});
