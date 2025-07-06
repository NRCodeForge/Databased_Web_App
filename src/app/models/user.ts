// Datei: src/app/models/user.ts

export interface User {
  UserID: number;
  Vorname: string;      // Geändert
  Nachname: string;     // Geändert
  Email: string;
  RolleID: number;
  RollenName?: string;
  Passwort?: string;
  ErstelltAm: string; // Geändert
}
