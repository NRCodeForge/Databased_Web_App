// Datei: src/app/models/post.ts

export interface Post {
  BeitragsID: number;
  Titel: string;
  Inhalt: string;
  Bild?: string;
  KategorieID: number;
  Kategorie?: string;
  Formart: 1 | 2 | 3 | 4; 
  UserID: number;
  Erstellungsdatum: string;
  Aenderungsdatum?: string;
}
