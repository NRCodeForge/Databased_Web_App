# 📦 Datenbankbasierte Webanwendung (MySQL + Angular)

Dies ist eine Webanwendung, die im Rahmen des Kurses **„Datenbankbasierte Webanwendung“** entwickelt wurde. Die Anwendung basiert auf einer MySQL-Datenbank im Backend und verwendet Angular für das Frontend.

---

## 📑 Projektübersicht

Ziel ist die Entwicklung einer voll funktionsfähigen datenbankgestützten Webanwendung mit CRUD-Funktionalitäten, Authentifizierung und sauberer Trennung zwischen Frontend und Backend.

---

## 🚧 Projektphasen

### 1. Anforderungsanalyse
- Definition der Zielgruppe und der Use Cases
- Erhebung funktionaler und nicht-funktionaler Anforderungen
- Erstellung eines Anforderungskatalogs

### 2. Konzeption & Architektur
- Entwurf des Datenmodells (ER-Diagramm, relationale Tabellenstruktur)
- Aufteilung in Frontend (Angularv19), Backend (z. B. Node.js/Spring), Datenbank (MySQL)
- Definition von REST-API-Endpunkten
- Sicherheitskonzept (z. B. Authentifizierung, Rollen)

### 3. Datenbankdesign (MySQL)
- Tabellenstruktur mit Primär- und Fremdschlüsseln
- Normalisierung der Datenbank
- SQL-Skripte zur Erstellung & Initialbefüllung
- Performance-Optimierung (Indexes, Views)

### 4. Backend-Implementierung
- Aufbau der REST-API
- CRUD-Logik für alle Ressourcen
- Verbindung zur MySQL-Datenbank
- Authentifizierungs- & Autorisierungssystem (JWT, Bcrypt)

### 5. Frontend-Implementierung (Angular)
- Aufbau der Angular-Komponentenstruktur
- Anbindung an die REST-API mit `HttpClient`
- Benutzeroberfläche mit Formularen & Validierung
- Authentifizierte Routen & Guards
- Responsives UI mit Angular Material/Bootstrap

### 6. Testphase
- Unit-Tests (Frontend & Backend)
- Integrationstests
- Datenbanktests (z. B. Constraints, Query-Tests)
- Manuelles UI-Testing

### 7. Deployment
- Build-Prozesse (Angular + Backend)
- Bereitstellung auf Webserver / Docker / lokal
- Konfiguration von Umgebungsvariablen & Sicherheitseinstellungen
- Optional: Hosting auf Plattformen wie Vercel, Firebase, Render, etc.

### 8. Dokumentation & Präsentation
- Projektdokumentation (PDF/Markdown)
- API-Dokumentation (OpenAPI/Postman)
- Anleitung zur lokalen Ausführung
- Präsentation/Demo für Stakeholder oder Bewertung

---

## ⚙️ Technologien

| Bereich    | Technologie       |
|-----------|-------------------|

---

## 🛠️ Lokale Installation

```bash
# 1. Repo klonen
git clone https://github.com/DEINUSERNAME/dein-projekt.git

# 2. Frontend starten
cd frontend
npm install
ng serve

# 3. Backend starten
cd backend
npm install
npm start

# 4. MySQL-DB vorbereiten
# Importiere das SQL-Skript aus /database/init.sql
```
---
# Schützenverein Huchting von 1911 e.V. - Website Architektur & Konzeption

## 1. 🚧 Phasen

### **1.1. Definition der Zielgruppe und der Use Cases**

#### **Zielgruppe**
Die Zielgruppe der geplanten Vereinswebsite des **Schützenvereins Huchting von 1911 e. V.** ist breit gefächert und richtet sich an:
- **Interessierte der allgemeinen Öffentlichkeit**, die für den Einstieg ins Sportschießen begeistert werden sollen,
- **alle Altersgruppen**, vom Jugendbereich bis hin zu Senioren,
- **bestehende Vereinsmitglieder**, die über Neuigkeiten, Termine und das Vereinsleben informiert bleiben möchten.

Die Nutzer haben grundsätzlich bereits Erfahrung mit Vereinsseiten und digitalen Angeboten. Die Anwendung soll auf **allen Endgeräten** (Smartphones, Tablets, Desktop-PCs) **gleich gut funktionieren**, barrierearm sein und **mehrsprachig** (Deutsch und Englisch) angeboten werden, um möglichst viele Menschen zu erreichen.

#### **Use Cases**
Die Website verfolgt zwei Hauptziele:
1. **Außenwirkung & Mitgliedergewinnung**: Sie soll Interessierte zum Sportschießen animieren und ihnen eine Möglichkeit zur Kontaktaufnahme und Information über den Verein bieten.
2. **Interne Kommunikation & Mitgliederservice**: Es soll ein Bereich für Vereinsmitglieder entstehen, der unter anderem ein **Forum**, eine **Terminübersicht** und **News-Anzeigen** bietet.

Typische Anwendungsfälle:
- Ein Besucher liest sich die Vereinsgeschichte und Angebote durch und tritt über ein Formular in Kontakt.
- Ein Mitglied loggt sich ein, um neue Forenbeiträge zu lesen und auf eine Veranstaltung zu reagieren.
- Ein Admin pflegt neue Termine oder Beiträge ins System ein.
- Ein WhatsApp-Bot informiert automatisch über neue Forumseinträge oder Veranstaltungen.

---

### **1.2. Funktionale und nicht-funktionale Anforderungen**

#### **Funktionale Anforderungen**
- **Nutzerrollen**: Admin, Abteilungsleiter, Mitglieder, Gäste (mit jeweils spezifischen Rechten).
- **Login-System**: Authentifizierte Nutzer können auf geschützte Inhalte zugreifen.
- **Forum**: Bereich für Diskussionen, sowohl allgemein als auch abteilungsspezifisch.
- **Terminverwaltung**: Anzeige von kommenden Terminen, inkl. Kategorien (Training, Wettkampf, Events etc.).
- **Newsbereich**: Aktuelle Meldungen des Vereins (z. B. Ergebnisse, interne Mitteilungen).
- **Benachrichtigungen**: Glockensymbol zur Signalisierung neuer Beiträge; optionaler **E-Mail-Versand** bei Aktivität.
- **API-Schnittstellen**, z. B. für WhatsApp-Bots zur automatisierten Kommunikation.
- **Mehrsprachigkeit**: Inhalte auf Deutsch und Englisch.
- **Kontaktformular & Beitrittsinformationen**.
- **Datenbankanbindung** zur strukturierten Verwaltung von Inhalten, Benutzern und Prozessen.

#### **Nicht-funktionale Anforderungen**
- **Performance**: Kurze Ladezeiten, Echtzeit-Aktualisierungen wenn möglich.
- **Sicherheit**: DSGVO-konforme Umsetzung, Zugriffskontrollen im Forum, sichere Login-Verfahren.
- **Plattformunabhängigkeit**: Kompatibilität mit allen gängigen Browsern und Geräten.
- **Design**: Modernes, übersichtliches und benutzerfreundliches Interface.
- **Barrierefreiheit**: Klare Navigation, Screenreader-Unterstützung, Kontraste, Schriftgrößen.
- **Wartbarkeit**: Leicht erweiterbar, modular aufgebaut, einfache Pflege der Inhalte durch Vereinsadmins.

---

### **1.3. Anforderungskatalog**

Die Anforderungen werden **zuerst nach Themenbereichen gruppiert** und anschließend innerhalb jeder Gruppe **nummeriert**. Dabei werden sie mit **Prioritäten** versehen:

- **M = Muss** (zwingend erforderlich)
- **S = Soll** (wünschenswert)
- **K = Kann** (optional)

#### **A. Benutzerverwaltung (M)**
- A1. Es gibt unterschiedliche Nutzerrollen (Admin, Abteilungsleiter, Mitglieder, Gäste). [M]
- A2. Nutzer können sich einloggen und ihr Profil verwalten. [M]
- A3. Zugriffsrechte auf Inhalte richten sich nach der Rolle. [M]

#### **B. Kommunikation & Forum (M)**
- B1. Mitglieder können Forenbeiträge lesen und schreiben. [M]
- B2. Es gibt abteilungsspezifische und allgemeine Foren. [M]
- B3. Nutzer werden per Glockensymbol und optional per E-Mail über neue Beiträge benachrichtigt. [S]
- B4. WhatsApp-Bot über API informiert über neue Beiträge. [K]

#### **C. Inhalte & Termine (M)**
- C1. Newsbereich zur Veröffentlichung aktueller Vereinsinformationen. [M]
- C2. Terminanzeige mit Filteroptionen (z. B. nach Abteilung, Veranstaltungstyp). [M]
- C3. Integration eines Kalenders oder Terminübersicht. [S]

#### **D. Präsentation & Nutzerführung (M)**
- D1. Startseite mit animierenden Inhalten für Außenstehende. [M]
- D2. Darstellung von Vereinsgeschichte, Beitrittsmöglichkeiten, Galerie etc. [S]
- D3. Mehrsprachigkeit (Deutsch, Englisch). [M]
- D4. Barrierefreiheit gemäß gängiger Standards. [M]

#### **E. Technik & Wartung (M)**
- E1. Responsive Design für alle Endgeräte. [M]
- E2. Datenbank zur Verwaltung von Nutzern, Inhalten, Terminen. [M]
- E3. Modularer Aufbau zur einfachen Erweiterbarkeit. [M]
- E4. DSGVO-konform (z. B. Impressum, Datenschutz, sichere Logins). [M]
- E5. Administratoren können Inhalte selbstständig pflegen. [M]

---

## 2. Datenmodell (ER-Diagramm und relationale Tabellenstruktur)

### Entitäten und Beziehungen

1. **Nutzer**
- **Attribute**: ID, Name, E-Mail, Passwort, Rolle (Admin, Abteilungsleiter, Mitglied), Anmeldedatum.
- **Beziehungen**:
  - Ein Nutzer **hat mehrere Beiträge**.
  - Ein Nutzer **gehört zu einer Abteilung**.

2. **Beiträge**
- **Attribute**: ID, Titel, Inhalt, Erstellungsdatum, Änderungsdatum, Nutzer-ID (Autor), Abteilung-ID.
- **Beziehungen**:
  - Ein Beitrag **gehört zu einer Abteilung**.
  - Ein Beitrag **hat mehrere Kommentare**.
  - Ein Beitrag **kann von einem Admin oder Abteilungsleiter bearbeitet werden**.

3. **Termine**
- **Attribute**: ID, Titel, Beschreibung, Datum, Uhrzeit, Ort, Abteilung-ID, Erstellungsdatum.
- **Beziehungen**:
  - Ein Termin **gehört zu einer Abteilung**.

4. **Abteilungen**
- **Attribute**: ID, Name, Beschreibung.
- **Beziehungen**:
  - Eine Abteilung **hat mehrere Termine** und **mehrere Beiträge**.

5. **Foren**(Optional)
- **Attribute**: ID, Name, Abteilung-ID, Erstellungsdatum.
- **Beziehungen**:
  - Ein Forum **gehört zu einer Abteilung**.
  - Ein Forum **hat mehrere Beiträge**.

6. **Kommentare**
- **Attribute**: ID, Inhalt, Erstellungsdatum, Beitrag-ID, Nutzer-ID.
- **Beziehungen**:
  - Ein Kommentar **gehört zu einem Beitrag**.

### Historisierung
- **News-Beiträge**: Alte Newsbeiträge bleiben im System gespeichert, jedoch als „archiviert“ markiert.
- **Forenbeiträge**: Bearbeitete Beiträge werden versioniert, um Änderungen nachvollziehbar zu machen.

---

## 3. Technologische Architektur

### Frontend: Angular
- **UI-Komponenten**:
  - **Login / Registrierung**: Authentifizierung von Nutzern.
  - **News und Termine**: Anzeigen von öffentlichen News und Terminen.
  - **Forum**: Interaktive Foren für Mitglieder, mit Kommentarfunktionen.
  - **Admin-Dashboard**: Verwaltungsbereich für Admins (News posten, Termine erstellen).
  - **Abteilungsleiter-Dashboard**: Verwaltung eigener Foren und Beiträge.

### Backend: Node.js mit TypeScript
- **REST-API**:
  - **Authentifizierung und Autorisierung**: Login-API für Nutzer, basierend auf Benutzername/E-Mail und Passwort.
  - **CRUD-Operationen** für Beiträge, Kommentare, News und Termine.
  - **API-Schnittstellen** für externe Systeme (z. B. WhatsApp-Bot, Vereinsverwaltungssoftware).

### Datenbank: MySQL
- **Tabellen**: Entsprechend der oben definierten Entitäten (Nutzer, Beiträge, Termine, Foren, Kommentare, Abteilungen).
- **Sicherheitsmaßnahmen**: Datenbankverschlüsselung für sensible Daten wie Passwörter.

---

## 4. REST-API-Endpunkte

- **GET /api/news**: Alle öffentlichen Newsbeiträge abrufen.
- **POST /api/news**: Neuen Newsbeitrag erstellen (nur für Admin).
- **GET /api/termine**: Alle öffentlichen Termine abrufen.
- **POST /api/termine**: Neuen Termin erstellen (nur für Admin oder Abteilungsleiter).
- **GET /api/forum/{abteilungId}**: Alle Forenbeiträge einer bestimmten Abteilung.
- **POST /api/forum/{abteilungId}/beitrag**: Beitrag zu einem Forum erstellen (nur für Abteilungsleiter und Admin).
- **GET /api/user/{id}**: Nutzerprofil anzeigen (geschützt).
- **POST /api/auth/login**: Login-Endpoint für Authentifizierung.
- **POST /api/auth/logout**: Logout-Endpoint.

---

## 5. Sicherheitskonzept

### Authentifizierung:
- Nutzer authentifizieren sich über **Benutzername/E-Mail** und **Passwort**.
- Passwörter werden **mit bcrypt** in der Datenbank gespeichert (verschlüsselt).
- Sessions oder **JWT (JSON Web Tokens)** zur Verwaltung der Nutzer-Session im Frontend.

### Rollen und Rechte:
- **Admin**: Vollzugriff auf alle Funktionen (News posten, alle Termine verwalten, Mitglieder verwalten).
- **Abteilungsleiter**: Zugriff auf ihr eigenes Forum und die Verwaltung von abteilungsbezogenen Beiträgen.
- **Mitglieder**: Nur Leserechte für News und Termine, können Beiträge im Forum schreiben und kommentieren.
- **Gast**: Zugriff auf öffentliche Inhalte wie News und Termine, keine Möglichkeit zu interagieren.

### Datenverschlüsselung:
- Alle **Kommunikation** zwischen Frontend und Backend erfolgt über **HTTPS**.
- **Datenverschlüsselung** bei Speicherung sensibler Daten in der Datenbank (z. B. Passwörter).
- **Logging**: Logging von sicherheitsrelevanten Ereignissen (Login-Versuche, Admin-Aktionen).

### Zugriffskontrollen:
- Überprüfung der **Rollen** im Backend für jede API-Anfrage.
- Implementierung eines **zentralen Berechtigung

ssystems** für die verschiedenen Nutzerrollen.

---
