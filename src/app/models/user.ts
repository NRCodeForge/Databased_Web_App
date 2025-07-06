// Datei: src/app/models/user.ts

export interface User {
  UserID: number;
  Vorname: string;      // Geändert
  Nachname: string;     // Geändert
  Benutzername?: string; // Wird von der API zur Anzeige erstellt, ist aber nicht in der DB
  Email: string;
  RolleID: number;
  ErstelltAm: string; // Geändert
}
