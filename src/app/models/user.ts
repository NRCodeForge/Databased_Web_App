/**
 * Repräsentiert einen Benutzer im System.
 *
 * @export
 * @interface User
 */
export interface User {
  /** Eindeutige Benutzer-ID */
  UserID: number;

  /** Vorname des Benutzers */
  Vorname: string;

  /** Nachname des Benutzers */
  Nachname: string;

  /** E-Mail-Adresse des Benutzers */
  Email: string;

  /** ID der Rolle des Benutzers */
  RollenID: number;

  /** Optionaler Name der Rolle */
  RollenName?: string;

  /** Optionales Passwort (meistens nur intern verwendet) */
  Passwort?: string;

  /** Erstellungsdatum des Benutzers im ISO-Format */
  ErstelltAm: string;
}
