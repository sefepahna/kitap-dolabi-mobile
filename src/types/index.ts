export type Category = "Roman" | "Bilim" | "Felsefe" | "Tarih" | "Kişisel Gelişim" | "Ders Kitabı";

export type CoverId = 1 | 2 | 3 | 4 | 5 | 6;

export interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
  category: Category;
  description: string;
  cover: CoverId;
  fee: number;
}

export interface Locker {
  id: string;
  name: string;
  location: string;
  slots: number;
}

export interface InventoryItem {
  bookId: string;
  copyId: string;
  rfid: string;
  slot: string;
  available: boolean;
}

export interface LockerBook extends Book, InventoryItem {}

export type RentalStatus = "active" | "returned";

export interface Rental {
  id: string;
  copyId: string;
  bookId: string;
  lockerId: string;
  slot: string;
  fee: number;
  startDate: string;
  dueDate: string;
  returnDate?: string;
  status: RentalStatus;
  phone: string;
}

export interface DemoState {
  copyStatus: Record<string, boolean>;
  rentals: Rental[];
}

export interface MockHistoryEntry {
  id: string;
  bookId: string;
  lockerId: string;
  startDate: string;
  returnDate: string;
}

export type PaymentResult = { ok: true };

export type OpenCompartmentResult = { slot: string };

export type ReturnFailureReason = "not_found" | "already_returned" | "wrong_locker";

export type ReturnResult = { ok: true; rental: Rental } | { ok: false; reason: ReturnFailureReason };
