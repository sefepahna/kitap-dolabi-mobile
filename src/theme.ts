/** Semantic tokens aligned with web `src/styles.css` (approx hex for React Native). */

export const colors = {
  background: "#f9f6f2",
  foreground: "#1e1a16",
  primary: "#1c3d2c",
  primaryForeground: "#f7f5f1",
  muted: "#eeebe5",
  mutedForeground: "#6e6762",
  accent: "#e0ebe4",
  destructive: "#bd4334",
  success: "#2a7449",
  border: "#dedad3",
  input: "#dedad3",
  card: "#fdfbf8",
} as const;

/** Procedural book-cover palette (cover 1–6 + ink). */
export const coverColors = {
  1: "#6b3a3a",
  2: "#2f3a52",
  3: "#c4a24a",
  4: "#3d5c4a",
  5: "#2a2826",
  6: "#b86a4b",
  ink: "#f8f5ee",
} as const;

export type CoverId = keyof Omit<typeof coverColors, "ink">;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Base radius 8px on web (`--radius: 0.5rem`). */
export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  display: 32,
} as const;

export const lineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
} as const;

export const fontFamily = {
  sansRegular: "InstrumentSans_400Regular",
  sansMedium: "InstrumentSans_500Medium",
  sansSemiBold: "InstrumentSans_600SemiBold",
  serifRegular: "Newsreader_400Regular",
  serifMedium: "Newsreader_500Medium",
} as const;
