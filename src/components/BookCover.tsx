import { StyleSheet, View } from "react-native";

import type { Book } from "../types";
import { coverColors, radius } from "../theme";
import { AppText } from "./ui/AppText";

type BookCoverProps = {
  book: Book;
  size?: "sm" | "lg";
};

export function BookCover({ book, size = "sm" }: BookCoverProps) {
  const isLarge = size === "lg";

  return (
    <View style={[styles.base, isLarge ? styles.lg : styles.sm, { backgroundColor: coverColors[book.cover] }]}>
      <View style={styles.spine} />
      <AppText variant="caption" color={coverColors.ink} style={isLarge ? styles.titleLg : styles.titleSm} numberOfLines={4}>
        {book.title}
      </AppText>
      <AppText variant="caption" color={coverColors.ink} style={isLarge ? styles.authorLg : styles.authorSm} numberOfLines={2}>
        {book.author.toLocaleUpperCase("tr")}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    aspectRatio: 2 / 3,
    overflow: "hidden",
    borderRadius: radius.sm,
    justifyContent: "space-between",
  },
  sm: {
    width: 64,
    padding: 6,
  },
  lg: {
    width: 160,
    padding: 16,
  },
  spine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "rgba(30, 26, 22, 0.2)",
  },
  titleSm: {
    fontFamily: "Newsreader_400Regular",
    fontSize: 9,
    lineHeight: 11,
  },
  titleLg: {
    fontFamily: "Newsreader_400Regular",
    fontSize: 18,
    lineHeight: 22,
  },
  authorSm: {
    fontSize: 6,
    letterSpacing: 0.4,
    opacity: 0.8,
  },
  authorLg: {
    fontSize: 10,
    letterSpacing: 0.6,
    opacity: 0.8,
  },
});
