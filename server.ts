import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

import mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

// Importieren Sie den InjectionToken
import { REQUEST } from './src/app/ssr.tokens';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  const commonEngine = new CommonEngine();

  const projectRoot = resolve(serverDistFolder, '../../../');
  dotenv.config({ path: join(projectRoot, 'data.env') });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use(cors());
  server.use(express.json());

  const pool = mysql.createPool({
    host: process.env['DB_HOST'],
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  server.use(express.static(browserDistFolder, {
    maxAge: '1y'
  }));
// API-Endpunkt für die Registrierung
  server.post('/api/register', async (req, res) => {
    // ... (Ihr bestehender Code, unverändert)
    const { email, password, vorname, nachname } = req.body;

    if (!email || !password || !vorname || !nachname) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
    }

    try {
      const [users] = await pool.query('SELECT BenutzerID FROM benutzer WHERE Email = ?', [email]);
      if (Array.isArray(users) && users.length > 0) {
        return res.status(409).json({ message: 'Ein Benutzer mit dieser E-Mail existiert bereits.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const defaultRole = 1; // Angenommen '1' ist die Standardrolle
      const time = new Date().toISOString()
      const [result] = await pool.query(
        'INSERT INTO benutzer (Email, Passwort, Vorname, Nachname, RollenID, ErstelltAm) VALUES (?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, vorname, nachname, defaultRole, time]
      );

      return res.status(201).json({ message: 'Benutzer erfolgreich registriert.', userId: (result as any).insertId });
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      return res.status(500).json({ message: 'Serverfehler bei der Registrierung.' });
    }
  });

  // API-Endpunkt für den Login
  server.post('/api/login', async (req, res) => {
    // ... (Ihr bestehender Code, unverändert)
    const { email, password } = req.body;
    try {
      const [rows] = await pool.query('SELECT * FROM benutzer WHERE Email = ?', [email]);
      const users = rows as any[];
      if (users.length === 0) {
        return res.status(401).json({ message: 'Ungültige Anmeldeinformationen.' });
      }
      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.Passwort);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Ungültige Anmeldeinformationen.' });
      }
      const token = jwt.sign({ id: user.BenutzerID, role: user.RollenID }, process.env['JWT_SECRET'] as string, { expiresIn: '1h' });
      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Serverfehler');
    }
  });

  // #############################################################
  // ##### NEUE API-ROUTEN FÜR DIE BENUTZERVERWALTUNG (ADMIN) #####
  // #############################################################

  server.get('/api/users', async (req, res) => {
    try {
      // KORREKTUR: Wählt die korrekten Spalten und erstellt 'Benutzername' zur Anzeige
      const sql = `
        SELECT
          BenutzerID as UserID,
          Vorname,
          Nachname,
          Email,
          RollenID,
          ErstelltAm
        FROM benutzer
      `;
      const [users] = await pool.query(sql);
      return res.json(users);
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzer:', error);
      return res.status(500).json({ message: 'Serverfehler' });
    }
  });

  // POST /api/users - Neuen Benutzer erstellen
  server.post('/api/users', async (req, res) => {
    // KORREKTUR: Verwendet Vorname und Nachname
    const { Vorname, Nachname, Email, Passwort, RolleID } = req.body;
    if (!Vorname || !Nachname || !Email || !Passwort || !RolleID) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
    }
    try {
      const hashedPassword = await bcrypt.hash(Passwort, 10);
      const sql = 'INSERT INTO benutzer (Vorname, Nachname, Email, Passwort, RollenID) VALUES (?, ?, ?, ?, ?)';
      const [result] = await pool.query(sql, [Vorname, Nachname, Email, hashedPassword, RolleID]);
      return res.status(201).json({ message: 'Benutzer erfolgreich erstellt', userId: (result as any).insertId });
    } catch (error) {
      console.error('Fehler beim Erstellen des Benutzers:', error);
      return res.status(500).json({ message: 'Serverfehler' });
    }
  });

  server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { Vorname, Nachname, Email, RollenID, Passwort } = req.body;

    // Überprüfen, ob die ID eine gültige Zahl ist
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).send('Ungültige UserID.');
    }

    try {
      if (Passwort && Passwort.length > 0) {
        // Fall 1: Passwort wird geändert
        const hashedPassword = await bcrypt.hash(Passwort, 10);
        await pool.query(
          'UPDATE benutzer SET Vorname = ?, Nachname = ?, Email = ?, RollenID = ?, Passwort = ? WHERE BenutzerID = ?',
          [Vorname, Nachname, Email, RollenID, hashedPassword, userId]
        );
      } else {
        // Fall 2: Passwort wird NICHT geändert
        await pool.query(
          'UPDATE benutzer SET Vorname = ?, Nachname = ?, Email = ?, RollenID = ? WHERE BenutzerID = ?',
          [Vorname, Nachname, Email, RollenID, userId]
        );
      }
      return res.status(200).json({ message: 'Benutzer erfolgreich aktualisiert.' });
    } catch (error) {
      console.error(`Fehler beim Aktualisieren von Benutzer ${userId}:`, error);
      return res.status(500).json({ message: 'Serverfehler beim Aktualisieren.' });
    }
  });

  // DELETE /api/users/:id - Einen Benutzer löschen
  server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    // Überprüfen, ob die ID eine gültige Zahl ist
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).send('Ungültige UserID.');
    }

    try {
      const [result] = await pool.query('DELETE FROM benutzer WHERE BenutzerID = ?', [userId]);

      // Prüfen, ob eine Zeile tatsächlich gelöscht wurde
      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
      }

      // Erfolgreich gelöscht
      return res.status(204).send(); // 204 No Content ist die Standardantwort für erfolgreiches Löschen
    } catch (error) {
      console.error(`Fehler beim Löschen von Benutzer ${userId}:`, error);
      return res.status(500).json({ message: 'Serverfehler beim Löschen.' });
    }
  });
  server.post('/api/track-view', async (req, res) => {
    const { path } = req.body;
    if (!path) {
      return res.status(400).json({ message: 'Pfad ist erforderlich.' });
    }
    try {
      const sql = 'INSERT INTO seitenaufrufe (Pfad) VALUES (?)';
      await pool.query(sql, [path]);
      return res.status(201).json({ message: 'Seitenaufruf erfolgreich gespeichert.' });
    } catch (error) {
      console.error('Fehler beim Speichern des Seitenaufrufs:', error);
      return res.status(500).json({ message: 'Serverfehler' });
    }
  });

// GET /api/page-views - Ruft aggregierte Daten für das Dashboard ab
  server.get('/api/page-views', async (req, res) => {
    try {
      // Diese Abfrage zählt die Aufrufe pro Tag für die letzten 30 Tage
      const sql = `
      SELECT DATE(AufrufZeitstempel) as Tag, COUNT(AufrufID) as Aufrufe
      FROM seitenaufrufe
      WHERE AufrufZeitstempel >= CURDATE() - INTERVAL 30 DAY
      GROUP BY Tag
      ORDER BY Tag ASC
    `;
      const [rows] = await pool.query(sql);
      return res.json(rows);
    } catch (error) {
      console.error('Fehler beim Abrufen der Seitenaufrufe:', error);
      return res.status(500).json({ message: 'Serverfehler' });
    }
  });

  // #############################################################
  // ##### BESTEHENDE ROUTEN (Posts, Kategorien, etc.)       #####
  // #############################################################

  // ... (Alle Ihre weiteren bestehenden Routen hier)
  // Content-Management Routen...
  server.get('/api/posts', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM beitraege');
    return res.json(rows);
  });

  server.post('/api/posts', async (req, res) => {
    const { Titel, Inhalt, KategorieID, UserID} = req.body;
    const [result] = await pool.query('INSERT INTO beitraege (Titel, Inhalt, KategorieID, ErstelltVon, Erstellungsdatum) VALUES (?, ?, ?, ?, NOW());', [Titel, Inhalt, KategorieID, UserID]);
    return res.status(201).json({ BeitragsID: (result as any).insertId, Titel, Inhalt, KategorieID, UserID });
  });

  server.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { Titel, Inhalt, KategorieID } = req.body;
    await pool.query('UPDATE beitraege SET Titel = ?, Inhalt = ?, KategorieID = ?, Aenderungsdatum = NOW() WHERE BeitragsID = ?', [Titel, Inhalt, KategorieID, id]);
    return res.json({ BeitragsID: id, Titel, Inhalt, KategorieID });
  });

  server.get('/api/categories', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM kategorien');
    return res.json(rows);
  });

  server.get('/api/departments', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM abteilungen');
    return res.json(rows);
  });

  // Angular Universal & Static Files
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          // Use the InjectionToken instead of a string
          { provide: REQUEST, useValue: req },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });


  // 1. Statische Dateien aus dem 'browser' Ordner bereitstellen
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // 2. Alle anderen Anfragen an den Angular Universal Engine weiterleiten
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: REQUEST, useValue: req },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}
function run(): void {
  const port = process.env['PORT'] || 4200;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();




