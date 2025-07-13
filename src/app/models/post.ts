/**
 * Repräsentiert einen Blog- oder Webseitenbeitrag (Post).
 *
 * @export
 * @interface Post
 */
export interface Post {
  /** Eindeutige Identifikationsnummer des Beitrags */
  BeitragsID: number;

  /** Titel des Beitrags */
  Titel: string;

  /** Inhalt des Beitrags */
  Inhalt: string;

  /** Optionales Bild zum Beitrag (URL oder Pfad) */
  Bild?: string;

  /** ID der Kategorie, zu der der Beitrag gehört */
  KategorieID: number;

  /** Optionaler Name der Kategorie */
  Kategorie?: string;

  /** ID des Benutzers, der den Beitrag erstellt hat */
  UserID: number;

  /** Erstellungsdatum des Beitrags im ISO-Format */
  Erstellungsdatum: string;

  /** Optionales Änderungsdatum des Beitrags im ISO-Format */
  Aenderungsdatum?: string;
}
