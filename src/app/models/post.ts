export interface Post {
  BeitragsID: number;
  Titel: string;
  Inhalt: string;
  KategorieID: number;
  Kategorie?: string;
  Erstellungsdatum: string;
  Aenderungsdatum?: string;
}
