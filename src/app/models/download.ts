/**
 * Schnittstelle zur Beschreibung eines Download-Elements.
 * 
 * @export
 * @interface Download
 */
export interface Download {
  /**
   * Eindeutige Identifikationsnummer des Downloads.
   */
  id: number;

  /**
   * Titel des Downloads.
   */
  title: string;

  /**
   * Beschreibung des Downloads.
   * Kann null sein, wenn keine Beschreibung vorliegt.
   */
  description: string | null;

  /**
   * URL zum Vorschaubild des Downloads.
   * Entspricht ShowcaseImageURL.
   * Kann null sein, wenn kein Bild vorhanden ist.
   */
  showcaseImage: string | null;

  /**
   * URL zum eigentlichen Download.
   * Entspricht DownloadURL.
   */
  downloadUrl: string;

  /**
   * Reihenfolge des Downloads für Sortierung.
   * Entspricht Reihenfolge.
   * Kann null sein, wenn keine Reihenfolge definiert ist.
   */
  order: number | null;

  /**
   * Optional: ID des Benutzers, der den Download erstellt hat.
   */
  ErstelltVon?: number;

  /**
   * Optional: Datum und Uhrzeit der Erstellung im ISO-Format.
   */
  Erstellungsdatum?: string;
}
