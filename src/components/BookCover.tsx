import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { bundledCoverFor, coverMode } from "../data/book-cover-sources";
import { colors, coverColors, radius } from "../theme";
import type { Book } from "../types";
import { AppText } from "./ui/AppText";

type BookCoverProps = {
  book: Book;
  size?: "sm" | "lg";
};

export function BookCover({ book, size = "sm" }: BookCoverProps) {
  const isLarge = size === "lg";
  const [failedBookId, setFailedBookId] = useState<string | null>(null);
  const imageFailed = failedBookId === book.id;
  const source = bundledCoverFor(book.id);

  if (coverMode(book.id, imageFailed) === "bundled" && source) {
    return (
      <View style={[styles.base, isLarge ? styles.lg : styles.sm, styles.bundled]}>
        <Image
          accessible
          accessibilityLabel={`${book.title}, ${book.author}`}
          source={source}
          resizeMode="contain"
          style={styles.image}
          onError={() => setFailedBookId(book.id)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.base, isLarge ? styles.lg : styles.sm, { backgroundColor: coverColors[book.cover] }]}>
      <View style={styles.spine} />
      <AppText
        variant="caption"
        color={coverColors.ink}
        style={isLarge ? styles.titleLg : styles.titleSm}
        numberOfLines={4}
      >
        {book.title}
      </AppText>
      <AppText
        variant="caption"
        color={coverColors.ink}
        style={isLarge ? styles.authorLg : styles.authorSm}
        numberOfLines={2}
      >
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
  bundled: {
    padding: 0,
    backgroundColor: colors.card,
  },
  image: {
    width: "100%",
    height: "100%",
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
