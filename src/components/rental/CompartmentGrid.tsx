// Locker compartment map. Slots come from inventory data; the active slot is highlighted.
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "../../theme";
import { AppText } from "../ui/AppText";

type CompartmentGridProps = {
  slots: string[];
  activeSlot: string;
  open: boolean;
};

const CELL_WIDTH = 48;
const CELL_HEIGHT = 40;
const COLUMNS = 4;
const GRID_GAP = 6;
const GRID_PADDING = spacing.sm;
const GRID_WIDTH = COLUMNS * CELL_WIDTH + (COLUMNS - 1) * GRID_GAP + GRID_PADDING * 2 + 2;

export function CompartmentGrid({ slots, activeSlot, open }: CompartmentGridProps) {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const active = slot === activeSlot;
        return (
          <View
            key={slot}
            style={[styles.cell, active && (open ? styles.cellOpen : styles.cellActive)]}
            accessibilityLabel={active ? `Bölme ${slot}` : undefined}
          >
            <AppText
              variant="caption"
              color={active && open ? colors.primaryForeground : active ? colors.foreground : colors.mutedForeground}
            >
              {slot}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: GRID_WIDTH,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    padding: GRID_PADDING,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  cellActive: {
    borderColor: colors.foreground,
  },
  cellOpen: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
});
