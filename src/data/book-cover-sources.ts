import type { ImageSourcePropType } from "react-native";

/** Bundled İş Kültür front covers. Paths must stay static for Metro. */
export const bookCoverSources: Partial<Record<string, ImageSourcePropType>> = {
  "kurk-mantolu-madonna": require("../../assets/book-covers/kurk-mantolu-madonna.jpg"),
  "devlet": require("../../assets/book-covers/devlet.jpg"),
  "donusum": require("../../assets/book-covers/donusum.jpg"),
  "insan-neyle-yasar": require("../../assets/book-covers/insan-neyle-yasar.jpg"),
  "beyaz-geceler": require("../../assets/book-covers/beyaz-geceler.jpg"),
  "yeraltindan-notlar": require("../../assets/book-covers/yeraltindan-notlar.jpg"),
  "gurur-ve-onyargi": require("../../assets/book-covers/gurur-ve-onyargi.jpg"),
  "dorian-grayin-portresi": require("../../assets/book-covers/dorian-grayin-portresi.jpg"),
  "savas-sanati": require("../../assets/book-covers/savas-sanati.jpg"),
  "sokratesin-savunmasi": require("../../assets/book-covers/sokratesin-savunmasi.jpg"),
  "suc-ve-ceza": require("../../assets/book-covers/suc-ve-ceza.jpg"),
  "kuyucakli-yusuf": require("../../assets/book-covers/kuyucakli-yusuf.jpg"),
};

export function bundledCoverFor(bookId: string): ImageSourcePropType | undefined {
  return bookCoverSources[bookId];
}

export function coverMode(bookId: string, imageFailed: boolean): "bundled" | "procedural" {
  if (imageFailed || bundledCoverFor(bookId) == null) return "procedural";
  return "bundled";
}
