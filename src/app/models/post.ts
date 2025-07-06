// Datei: src/app/models/post.ts

export interface Post {
  BeitragsID: number;
  Titel: string;
  Inhalt: string;
  Bild?: string;
  KategorieID: number;
  Kategorie?: string;
  UserID: number;
  Erstellungsdatum: string;
  Aenderungsdatum?: string;
}
