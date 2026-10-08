// Local mock data. Replace with real API calls later.

import type { Book, Category, InventoryItem, Locker, LockerBook, MockHistoryEntry } from "../types";

export type { Book, Category, InventoryItem, Locker, LockerBook, MockHistoryEntry };

export const categories: Category[] = ["Roman", "Bilim", "Felsefe", "Tarih", "Kişisel Gelişim", "Ders Kitabı"];

/** Demo rental price in TL. Independent of the publisher retail price. */
export const DEMO_RENTAL_FEE = 40;

export const books: Book[] = [
  {
    id: "kurk-mantolu-madonna",
    fee: DEMO_RENTAL_FEE,
    title: "Kürk Mantolu Madonna",
    author: "Sabahattin Ali",
    pages: 176,
    category: "Roman",
    cover: 1,
    description: "Çevirmenlik yapan Raif Efendi'nin İstanbul ve Berlin yıllarını anlatan roman.",
  },
  {
    id: "devlet",
    fee: DEMO_RENTAL_FEE,
    title: "Devlet",
    author: "Platon",
    pages: 392,
    category: "Felsefe",
    cover: 4,
    description: "Adalet, eşitlik ve ideal düzen üzerine Platon diyalogu (Politeia).",
  },
  {
    id: "donusum",
    fee: DEMO_RENTAL_FEE,
    title: "Dönüşüm",
    author: "Franz Kafka",
    pages: 80,
    category: "Roman",
    cover: 2,
    description: "Kumaş pazarlamacısı Gregor Samsa'nın dönüşümünü anlatan Kafka metni.",
  },
  {
    id: "insan-neyle-yasar",
    fee: DEMO_RENTAL_FEE,
    title: "İnsan Neyle Yaşar?",
    author: "Lev Tolstoy",
    pages: 96,
    category: "Roman",
    cover: 3,
    description: "İnsan sevgisi ve inanç üzerine Tolstoy anlatısı.",
  },
  {
    id: "beyaz-geceler",
    fee: DEMO_RENTAL_FEE,
    title: "Beyaz Geceler",
    author: "Fyodor Dostoyevski",
    pages: 208,
    category: "Roman",
    cover: 5,
    description: "Beyaz Geceler ile 1848 tarihli kısa anlatıları bir araya getiren baskı.",
  },
  {
    id: "yeraltindan-notlar",
    fee: DEMO_RENTAL_FEE,
    title: "Yeraltından Notlar",
    author: "Fyodor Dostoyevski",
    pages: 144,
    category: "Roman",
    cover: 6,
    description: "Kendini gerçek dünyadan soyutlamış bir kişinin iç çatışmalarını anlatan roman.",
  },
  {
    id: "gurur-ve-onyargi",
    fee: DEMO_RENTAL_FEE,
    title: "Gurur ve Önyargı",
    author: "Jane Austen",
    pages: 404,
    category: "Roman",
    cover: 1,
    description: "Jane Austen'ın 1813'te yayımlanan romanı.",
  },
  {
    id: "dorian-grayin-portresi",
    fee: DEMO_RENTAL_FEE,
    title: "Dorian Gray'in Portresi",
    author: "Oscar Wilde",
    pages: 264,
    category: "Roman",
    cover: 2,
    description: "Oscar Wilde'ın romanı.",
  },
  {
    id: "savas-sanati",
    fee: DEMO_RENTAL_FEE,
    title: "Savaş Sanatı",
    author: "Sun Zi",
    pages: 64,
    category: "Felsefe",
    cover: 3,
    description: "Sun Zi'nin strateji üzerine klasik metni.",
  },
  {
    id: "sokratesin-savunmasi",
    fee: DEMO_RENTAL_FEE,
    title: "Sokrates'in Savunması",
    author: "Platon",
    pages: 222,
    category: "Felsefe",
    cover: 4,
    description: "Sokrates'in Savunması ve Phaidon'u içeren ciltli Platon baskısı.",
  },
  {
    id: "suc-ve-ceza",
    fee: DEMO_RENTAL_FEE,
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    pages: 704,
    category: "Roman",
    cover: 5,
    description: "Dostoyevski'nin ciltli İş Kültür baskısı.",
  },
  {
    id: "kuyucakli-yusuf",
    fee: DEMO_RENTAL_FEE,
    title: "Kuyucaklı Yusuf",
    author: "Sabahattin Ali",
    pages: 232,
    category: "Roman",
    cover: 6,
    description: "Nazilli'den Edremit'e uzanan, Yusuf'un kasaba hayatıyla karşılaşmasını anlatan roman.",
  },
];

export const lockers: Locker[] = [
  {
    id: "bogazici-kuzey",
    name: "Boğaziçi Üniversitesi · Kuzey Kampüs",
    location: "Kuzey Yurtları girişi, Sarıyer",
    slots: 12,
  },
];

export const inventory: Record<string, InventoryItem[]> = {
  "bogazici-kuzey": [
    { bookId: "kurk-mantolu-madonna", copyId: "bk-a1", rfid: "RF-A1-020", slot: "A1", available: true },
    { bookId: "donusum", copyId: "bk-a2", rfid: "RF-A2-014", slot: "A2", available: false },
    { bookId: "insan-neyle-yasar", copyId: "bk-a3", rfid: "RF-A3-017", slot: "A3", available: true },
    { bookId: "beyaz-geceler", copyId: "bk-a4", rfid: "RF-A4-07", slot: "A4", available: true },
    { bookId: "yeraltindan-notlar", copyId: "bk-b1", rfid: "RF-B1-06", slot: "B1", available: true },
    { bookId: "gurur-ve-onyargi", copyId: "bk-b2", rfid: "RF-B2-019", slot: "B2", available: false },
    { bookId: "devlet", copyId: "bk-b3", rfid: "RF-B3-06", slot: "B3", available: true },
    { bookId: "dorian-grayin-portresi", copyId: "bk-b4", rfid: "RF-B4-07", slot: "B4", available: true },
    { bookId: "savas-sanati", copyId: "bk-c1", rfid: "RF-C1-05", slot: "C1", available: false },
    { bookId: "sokratesin-savunmasi", copyId: "bk-c2", rfid: "RF-C2-020", slot: "C2", available: true },
    { bookId: "kuyucakli-yusuf", copyId: "bk-c3", rfid: "RF-C3-08", slot: "C3", available: true },
    { bookId: "suc-ve-ceza", copyId: "bk-c4", rfid: "RF-C4-019", slot: "C4", available: false },
  ],
};

export const DEFAULT_LOCKER_ID = "bogazici-kuzey";

export function getLocker(id: string) {
  return lockers.find((l) => l.id === id);
}

export function getLockerBooks(lockerId: string): LockerBook[] {
  return (inventory[lockerId] ?? []).flatMap((item) => {
    const book = books.find((b) => b.id === item.bookId);
    return book ? [{ ...book, ...item }] : [];
  });
}

export function getLockerBook(lockerId: string, bookId: string) {
  return getLockerBooks(lockerId).find((b) => b.id === bookId);
}

export function rentalDays(pages: number): number {
  if (pages <= 150) return 7;
  if (pages <= 300) return 10;
  if (pages <= 450) return 14;
  return 21;
}

export function dueDate(days: number, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export function returnDate(days: number, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export const mockHistory: MockHistoryEntry[] = [
  {
    id: "h-1",
    bookId: "kuyucakli-yusuf",
    lockerId: "bogazici-kuzey",
    startDate: "2026-08-28",
    returnDate: "2026-09-03",
  },
  { id: "h-2", bookId: "devlet", lockerId: "bogazici-kuzey", startDate: "2026-09-08", returnDate: "2026-09-19" },
];
