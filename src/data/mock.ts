// Local mock data. Replace with real API calls later.

import type { Book, Category, InventoryItem, Locker, LockerBook, MockHistoryEntry } from "../types";

export type { Book, Category, InventoryItem, Locker, LockerBook, MockHistoryEntry };

export const categories: Category[] = ["Roman", "Bilim", "Felsefe", "Tarih", "Kişisel Gelişim", "Ders Kitabı"];

export const books: Book[] = [
  { id: "kurk-mantolu-madonna", fee: 40, title: "Kürk Mantolu Madonna", author: "Sabahattin Ali", pages: 160, category: "Roman", cover: 1, description: "Raif Efendi'nin defterinden okunan, Berlin'de geçen sessiz ve derin bir aşk hikâyesi." },
  { id: "tutunamayanlar", fee: 55, title: "Tutunamayanlar", author: "Oğuz Atay", pages: 724, category: "Roman", cover: 5, description: "Selim Işık'ın intiharının ardından arkadaşı Turgut'un onun izini sürdüğü, Türk edebiyatının kilometre taşı." },
  { id: "saatleri-ayarlama", fee: 45, title: "Saatleri Ayarlama Enstitüsü", author: "Ahmet Hamdi Tanpınar", pages: 382, category: "Roman", cover: 3, description: "Doğu ile Batı arasında sıkışmış bir toplumu ironik bir dille anlatan modern klasik." },
  { id: "sapiens", fee: 50, title: "Sapiens", author: "Yuval Noah Harari", pages: 412, category: "Tarih", cover: 6, description: "İnsan türünün bilişsel devrimden bugüne uzanan hikâyesine geniş bir bakış." },
  { id: "kozmos", fee: 45, title: "Kozmos", author: "Carl Sagan", pages: 368, category: "Bilim", cover: 2, description: "Evrenin ve bilimin tarihine merak uyandıran, anlaşılır bir yolculuk." },
  { id: "zamanin-kisa-tarihi", fee: 40, title: "Zamanın Kısa Tarihi", author: "Stephen Hawking", pages: 232, category: "Bilim", cover: 5, description: "Büyük patlamadan kara deliklere, zamanın doğasını sade bir dille anlatan klasik." },
  { id: "devlet", fee: 45, title: "Devlet", author: "Platon", pages: 352, category: "Felsefe", cover: 4, description: "Adalet, eğitim ve ideal toplum üzerine Sokrates'in diyaloglarıyla kurulan temel metin." },
  { id: "yabanci", fee: 35, title: "Yabancı", author: "Albert Camus", pages: 112, category: "Felsefe", cover: 3, description: "Meursault'nun kayıtsızlığı üzerinden absürdü sorgulayan kısa ve çarpıcı bir roman." },
  { id: "nutuk", fee: 50, title: "Nutuk", author: "Mustafa Kemal Atatürk", pages: 600, category: "Tarih", cover: 1, description: "1919–1927 yılları arasındaki olayları birinci elden aktaran tarihi metin." },
  { id: "atomik-aliskanliklar", fee: 45, title: "Atomik Alışkanlıklar", author: "James Clear", pages: 320, category: "Kişisel Gelişim", cover: 6, description: "Küçük değişikliklerin zamanla nasıl büyük sonuçlar doğurduğunu anlatan pratik rehber." },
  { id: "calculus", fee: 60, title: "Calculus: Erken Transandantal", author: "James Stewart", pages: 1040, category: "Ders Kitabı", cover: 2, description: "Mühendislik ve fen fakültelerinde temel kaynak olarak kullanılan analiz kitabı." },
  { id: "ekonominin-ilkeleri", fee: 58, title: "Ekonominin İlkeleri", author: "N. Gregory Mankiw", pages: 880, category: "Ders Kitabı", cover: 4, description: "Mikro ve makro iktisada giriş derslerinin yaygın başvuru kitabı." },
];

export const lockers: Locker[] = [
  { id: "bogazici-kuzey", name: "Boğaziçi Üniversitesi · Kuzey Kampüs", location: "Kuzey Yurtları girişi, Sarıyer", slots: 12 },
];

export const inventory: Record<string, InventoryItem[]> = {
  "bogazici-kuzey": [
    { bookId: "kurk-mantolu-madonna", copyId: "bk-a1", rfid: "RF-A1-020", slot: "A1", available: true },
    { bookId: "tutunamayanlar", copyId: "bk-a2", rfid: "RF-A2-014", slot: "A2", available: false },
    { bookId: "saatleri-ayarlama", copyId: "bk-a3", rfid: "RF-A3-017", slot: "A3", available: true },
    { bookId: "sapiens", copyId: "bk-a4", rfid: "RF-A4-07", slot: "A4", available: true },
    { bookId: "kozmos", copyId: "bk-b1", rfid: "RF-B1-06", slot: "B1", available: true },
    { bookId: "zamanin-kisa-tarihi", copyId: "bk-b2", rfid: "RF-B2-019", slot: "B2", available: false },
    { bookId: "devlet", copyId: "bk-b3", rfid: "RF-B3-06", slot: "B3", available: true },
    { bookId: "yabanci", copyId: "bk-b4", rfid: "RF-B4-07", slot: "B4", available: true },
    { bookId: "nutuk", copyId: "bk-c1", rfid: "RF-C1-05", slot: "C1", available: false },
    { bookId: "atomik-aliskanliklar", copyId: "bk-c2", rfid: "RF-C2-020", slot: "C2", available: true },
    { bookId: "calculus", copyId: "bk-c3", rfid: "RF-C3-08", slot: "C3", available: true },
    { bookId: "ekonominin-ilkeleri", copyId: "bk-c4", rfid: "RF-C4-019", slot: "C4", available: false },
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
  { id: "h-1", bookId: "yabanci", lockerId: "bogazici-kuzey", startDate: "2026-08-28", returnDate: "2026-09-03" },
  { id: "h-2", bookId: "devlet", lockerId: "bogazici-kuzey", startDate: "2026-09-08", returnDate: "2026-09-19" },
];
