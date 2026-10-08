import { describe, expect, it } from "vitest";

import { filterBooks } from "../book-browser";
import { getLockerBooks } from "../../data/mock";

const books = getLockerBooks("bogazici-kuzey");

describe("BookBrowser filters", () => {
  it("matches Turkish title search case-insensitively", () => {
    const result = filterBooks(books, "kürk", null, false);
    expect(result.some((book) => book.id === "kurk-mantolu-madonna")).toBe(true);
  });

  it("matches author search", () => {
    const result = filterBooks(books, "platon", null, false);
    expect(result.map((book) => book.id).sort()).toEqual(["devlet", "sokratesin-savunmasi"]);
  });

  it("filters by category", () => {
    const result = filterBooks(books, "", "Felsefe", false);
    expect(result.every((book) => book.category === "Felsefe")).toBe(true);
  });

  it("filters available-only using current availability flags", () => {
    const result = filterBooks(books, "", null, true);
    expect(result.every((book) => book.available)).toBe(true);
  });
});
