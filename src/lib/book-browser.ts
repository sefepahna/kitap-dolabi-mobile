import type { Category, LockerBook } from "../types";

export function filterBooks(
  books: LockerBook[],
  query: string,
  category: Category | null,
  onlyAvailable: boolean,
): LockerBook[] {
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
}
