import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { bookCoverSources, coverMode } from "../../data/book-cover-sources";
import { DEMO_RENTAL_FEE, DEFAULT_LOCKER_ID, books, inventory, mockHistory } from "../../data/mock";

const APPROVED_IDS = [
  "kurk-mantolu-madonna",
  "devlet",
  "donusum",
  "insan-neyle-yasar",
  "beyaz-geceler",
  "yeraltindan-notlar",
  "gurur-ve-onyargi",
  "dorian-grayin-portresi",
  "savas-sanati",
  "sokratesin-savunmasi",
  "suc-ve-ceza",
  "kuyucakli-yusuf",
] as const;

const REMOVED_IDS = [
  "tutunamayanlar",
  "saatleri-ayarlama",
  "sapiens",
  "kozmos",
  "zamanin-kisa-tarihi",
  "yabanci",
  "nutuk",
  "atomik-aliskanliklar",
  "calculus",
  "ekonominin-ilkeleri",
];

const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

describe("approved catalog inventory", () => {
  const copies = inventory[DEFAULT_LOCKER_ID] ?? [];

  it("contains exactly the 12 approved books", () => {
    expect(books).toHaveLength(12);
    expect(books.map((book) => book.id)).toEqual([...APPROVED_IDS]);
    expect(new Set(books.map((book) => book.id)).size).toBe(12);
  });

  it("keeps one valid copy per compartment at the demo locker", () => {
    const bookIds = new Set(books.map((book) => book.id));
    expect(copies).toHaveLength(12);
    expect(copies.every((copy) => bookIds.has(copy.bookId))).toBe(true);
    expect(new Set(copies.map((copy) => copy.copyId)).size).toBe(12);
    expect(new Set(copies.map((copy) => copy.slot)).size).toBe(12);
    expect(new Set(copies.map((copy) => copy.bookId))).toEqual(bookIds);
  });

  it("starts with 8 available copies and 4 rented out", () => {
    expect(copies.filter((copy) => copy.available)).toHaveLength(8);
    expect(copies.filter((copy) => !copy.available)).toHaveLength(4);
  });

  it("keeps the demo rental price on every title", () => {
    expect(books.every((book) => book.fee === DEMO_RENTAL_FEE)).toBe(true);
  });

  it("drops removed books from inventory and rental history", () => {
    const referenced = [
      ...books.map((book) => book.id),
      ...copies.map((copy) => copy.bookId),
      ...mockHistory.map((entry) => entry.bookId),
    ];
    expect(referenced.some((id) => REMOVED_IDS.includes(id))).toBe(false);
  });

  it("registers each bundled cover under a real book id", () => {
    const bookIds = new Set(books.map((book) => book.id));
    const registered = Object.keys(bookCoverSources);
    expect(registered.sort()).toEqual([...APPROVED_IDS].sort());
    expect(registered.every((id) => bookIds.has(id))).toBe(true);

    for (const id of APPROVED_IDS) {
      const bytes = readFileSync(new URL(`../../../assets/book-covers/${id}.jpg`, import.meta.url));
      expect(bytes.subarray(0, 3)).toEqual(JPEG_MAGIC);
      expect(bytes.length).toBeGreaterThan(1000);
    }
  });

  it("falls back to the procedural cover when no bundled image is registered", () => {
    expect(coverMode("kurk-mantolu-madonna", false)).toBe("bundled");
    expect(coverMode("missing-book", false)).toBe("procedural");
    expect(coverMode("kurk-mantolu-madonna", true)).toBe("procedural");
  });
});
