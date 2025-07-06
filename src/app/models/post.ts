// Datei: src/app/models/post.ts

export interface Post {
  BeitragsID: number;
  Titel: string;
  Inhalt: string;
  KategorieID: number;
  Kategorie?: string;
  Erstellungsdatum: string;
  Aenderungsdatum?: string;
}
