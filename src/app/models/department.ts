/**
 * Schnittstelle zur Beschreibung einer Abteilung.
 * 
 * @export
 * @interface Department
 */
export interface Department {
  /**
   * Eindeutige Identifikationsnummer der Abteilung.
   */
  AbteilungsID: number;

  /**
   * Name der Abteilung.
   */
  Abteilungsname: string;

  /**
   * Beschreibung der Abteilung.
   */
  Beschreibung: string;

  /**
   * Optionale Liste von Bild-URLs, die zur Abteilung gehören.
   */
  Bilder?: string[];
}
