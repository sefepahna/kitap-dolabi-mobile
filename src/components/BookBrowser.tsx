import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
  type ListRenderItem,
} from "react-native";
import { Search } from "lucide-react-native";
import { useRouter } from "expo-router";

import { categories } from "../data/mock";
import type { Category, LockerBook } from "../types";
import { colors, fontFamily, fontSize, radius, spacing } from "../theme";
import { BookCover } from "./BookCover";
import { AppText } from "./ui/AppText";

type BookBrowserProps = {
  lockerId: string;
  books: LockerBook[];
  onlyAvailableDefault?: boolean;
  listHeader?: React.ReactNode;
};

export function BookBrowser({ books, onlyAvailableDefault = false, listHeader }: BookBrowserProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(onlyAvailableDefault);

  const list = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr");
    return books
      .filter((book) => !category || book.category === category)
      .filter((book) => !onlyAvailable || book.available)
      .filter(
        (book) =>
          !normalized ||
          book.title.toLocaleLowerCase("tr").includes(normalized) ||
          book.author.toLocaleLowerCase("tr").includes(normalized),
      )
      .sort((a, b) => Number(b.available) - Number(a.available));
  }, [books, query, category, onlyAvailable]);

  const usedCategories = categories.filter((item) => books.some((book) => book.category === item));

  const renderItem: ListRenderItem<LockerBook> = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.row, !item.available && styles.rowUnavailable, pressed && styles.rowPressed]}
      onPress={() => router.push({ pathname: "/book/[bookId]", params: { bookId: item.id } })}
    >
      <BookCover book={item} />
      <View style={styles.rowBody}>
        <AppText variant="heading" style={styles.rowTitle} numberOfLines={2}>
          {item.title}
        </AppText>
        <AppText variant="body" muted numberOfLines={1}>
          {item.author}
        </AppText>
        <View style={styles.metaRow}>
          <View style={[styles.statusDot, item.available ? styles.statusAvailable : styles.statusRented]} />
          <AppText variant="caption" muted>
            {item.available ? "Müsait" : "Kirada"} · {item.category} · Bölme {item.slot}
          </AppText>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View>
          {listHeader}
          <View style={styles.searchBox}>
            <Search color={colors.mutedForeground} size={16} strokeWidth={1.6} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Kitap adı veya yazar ara"
              placeholderTextColor={colors.mutedForeground}
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {[null, ...usedCategories].map((item) => {
              const selected = category === item;
              return (
                <Pressable key={item ?? "all"} onPress={() => setCategory(item)} style={styles.categoryTab}>
                  <AppText variant="body" color={selected ? colors.foreground : colors.mutedForeground} style={selected ? styles.categoryActive : undefined}>
                    {item ?? "Tümü"}
                  </AppText>
                  <View style={[styles.categoryUnderline, selected && styles.categoryUnderlineActive]} />
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.filterRow}>
            <AppText variant="caption" muted>
              {list.length} kitap
            </AppText>
            <View style={styles.switchRow}>
              <Switch
                value={onlyAvailable}
                onValueChange={setOnlyAvailable}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
              <AppText variant="caption" muted>
                Sadece müsait olanlar
              </AppText>
            </View>
          </View>
        </View>
      }
      ListEmptyComponent={
        <AppText variant="body" muted style={styles.empty}>
          Aramanıza uygun kitap bulunamadı.
        </AppText>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.sansRegular,
    fontSize: fontSize.md,
    color: colors.foreground,
    paddingVertical: 0,
  },
  categoryRow: {
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryTab: {
    alignItems: "center",
    paddingBottom: spacing.sm,
  },
  categoryActive: {
    fontFamily: fontFamily.sansMedium,
  },
  categoryUnderline: {
    marginTop: spacing.sm,
    height: 2,
    alignSelf: "stretch",
    backgroundColor: "transparent",
  },
  categoryUnderlineActive: {
    backgroundColor: colors.foreground,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowUnavailable: {
    opacity: 0.6,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: fontSize.lg,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: "auto",
    paddingTop: spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusAvailable: {
    backgroundColor: colors.success,
  },
  statusRented: {
    backgroundColor: colors.mutedForeground,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  empty: {
    textAlign: "center",
    paddingVertical: spacing.xxl,
  },
});
