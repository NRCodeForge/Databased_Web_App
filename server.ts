// server.ts
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
import { sendMail } from './src/app/services/email.service';

// Importieren Sie den InjectionToken
import { REQUEST } from './src/app/ssr.tokens';

// NEU: Multer für Dateiuploads
import multer from 'multer';
import fs from 'fs'; // Zum Erstellen von Verzeichnissen

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

  // NEU: Konfiguration für Multer
  const uploadsDir = join(projectRoot, 'uploads');
  // Erstelle das uploads-Verzeichnis, falls es nicht existiert
  if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  // Stelle das uploads-Verzeichnis statisch bereit, damit die Dateien zugänglich sind
  server.use('/uploads', express.static(uploadsDir));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });

  const upload = multer({ storage: storage });


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
  server.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
    }

    try {
      await sendMail(to, subject, text);
      return res.status(200).json({ message: 'E-Mail erfolgreich gesendet.' });
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
      return res.status(500).json({ message: 'Serverfehler beim Senden der E-Mail.' });
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
    const { Vorname, Nachname, Email, Passwort, RollenID } = req.body;
    if (!Vorname || !Nachname || !Email || !Passwort || !RollenID) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
    }
    try {
      const hashedPassword = await bcrypt.hash(Passwort, 10);
      const sql = 'INSERT INTO benutzer (Vorname, Nachname, Email, Passwort, RollenID) VALUES (?, ?, ?, ?, ?)';
      const [result] = await pool.query(sql, [Vorname, Nachname, Email, hashedPassword, RollenID]);
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

  server.get('/api/beitraege', async (req, res) => {
    const kategorieId = parseInt(req.query['kategorieId'] as string);

    if (isNaN(kategorieId)) {
      return res.status(400).json({ error: 'Ungültige KategorieId' });
    }

    try {
      const [rows] = await pool.query(
        'SELECT BeitragsID AS id, Titel AS titel, Inhalt AS inhalt FROM beitraege WHERE KategorieID = ? ORDER BY id DESC',
        [kategorieId]
      );
      res.json(rows);
    } catch (error) {
      console.error('DB Fehler:', error);
      res.status(500).json({ error: 'Datenbankfehler' });
    }
    return;
  });

  // #############################################################
  // ##### NEUE API-ROUTEN FÜR DOWNLOADS #####
  // #############################################################

  // GET /api/downloads - Alle Download-Elemente abrufen, sortiert nach Reihenfolge
  server.get('/api/downloads', async (req, res) => {
    try {
      const [downloads] = await pool.query('SELECT DownloadID AS id, Titel AS title, Beschreibung AS description, ShowcaseImageURL AS showcaseImage, DownloadURL AS downloadUrl, Reihenfolge AS `order` FROM downloads ORDER BY Reihenfolge ASC, DownloadID DESC');
      return res.json(downloads);
    } catch (error) {
      console.error('Fehler beim Abrufen der Downloads:', error);
      return res.status(500).json({ message: 'Serverfehler' });
    }
  });

  // POST /api/downloads - Neues Download-Element erstellen (mit Dateiupload)
  server.post('/api/downloads', upload.fields([
    { name: 'showcaseImage', maxCount: 1 },
    { name: 'downloadFile', maxCount: 1 }
  ]), async (req, res) => {
    const { title, description, userId } = req.body;
    const showcaseImageFile = (req.files as any)?.showcaseImage?.[0];
    const downloadFile = (req.files as any)?.downloadFile?.[0];

    // Überprüfen Sie, ob die erforderlichen Felder und Dateien vorhanden sind
    if (!title || !userId || !downloadFile) {
      // Löschen Sie hochgeladene Dateien, wenn die Validierung fehlschlägt
      if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
      if (downloadFile) fs.unlinkSync(downloadFile.path);
      return res.status(400).json({ message: 'Titel, Download-Datei und Benutzer-ID sind erforderlich.' });
    }

    const showcaseImageURL = showcaseImageFile ? `/uploads/${showcaseImageFile.filename}` : null;
    const downloadURL = `/uploads/${downloadFile.filename}`;

    try {
      const [maxOrderResult] = await pool.query('SELECT MAX(Reihenfolge) AS maxOrder FROM downloads');
      const maxOrder = (maxOrderResult as any[])[0].maxOrder || 0;
      const newOrder = maxOrder + 1;

      const sql = 'INSERT INTO downloads (Titel, Beschreibung, ShowcaseImageURL, DownloadURL, Reihenfolge, ErstelltVon, Erstellungsdatum) VALUES (?, ?, ?, ?, ?, ?, NOW())';
      const [result] = await pool.query(sql, [title, description, showcaseImageURL, downloadURL, newOrder, userId]);
      return res.status(201).json({ message: 'Download erfolgreich erstellt', downloadId: (result as any).insertId });
    } catch (error) {
      console.error('Fehler beim Erstellen des Downloads:', error);
      // Löschen Sie hochgeladene Dateien bei Datenbankfehlern
      if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
      if (downloadFile) fs.unlinkSync(downloadFile.path);
      return res.status(500).json({ message: 'Serverfehler beim Erstellen des Downloads.' });
    }
  });

  // PUT /api/downloads/:id - Ein bestehendes Download-Element aktualisieren (mit Dateiupload)
  server.put('/api/downloads/:id', upload.fields([
    { name: 'showcaseImage', maxCount: 1 },
    { name: 'downloadFile', maxCount: 1 }
  ]), async (req, res) => {
    const { id } = req.params;
    const { title, description, order, userId } = req.body; // userId ist hier der "ErstelltVon" Nutzer
    const showcaseImageFile = (req.files as any)?.showcaseImage?.[0];
    const downloadFile = (req.files as any)?.downloadFile?.[0];

    const downloadId = parseInt(id, 10);
    if (isNaN(downloadId)) {
      if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
      if (downloadFile) fs.unlinkSync(downloadFile.path);
      return res.status(400).send('Ungültige DownloadID.');
    }

    try {
      // Aktuelle Download-Info abrufen, um alte Dateipfade zu erhalten
      const [currentDownloads] = await pool.query('SELECT ShowcaseImageURL, DownloadURL FROM downloads WHERE DownloadID = ?', [downloadId]);
      const currentDownload = (currentDownloads as any[])[0];

      let showcaseImageURL = req.body.showcaseImage; // Kann auch eine bestehende URL sein (wenn keine neue Datei hochgeladen wurde)
      let downloadURL = req.body.downloadUrl; // Kann auch eine bestehende URL sein

      // Wenn eine neue Showcase-Datei hochgeladen wurde
      if (showcaseImageFile) {
        if (currentDownload && currentDownload.ShowcaseImageURL) {
          try {
            fs.unlinkSync(join(projectRoot, currentDownload.ShowcaseImageURL)); // Alte Datei löschen
          } catch (unlinkError) {
            console.warn(`Konnte alte Showcase-Datei nicht löschen: ${currentDownload.ShowcaseImageURL}`, unlinkError);
          }
        }
        showcaseImageURL = `/uploads/${showcaseImageFile.filename}`;
      }

      // Wenn eine neue Download-Datei hochgeladen wurde
      if (downloadFile) {
        if (currentDownload && currentDownload.DownloadURL) {
          try {
            fs.unlinkSync(join(projectRoot, currentDownload.DownloadURL)); // Alte Datei löschen
          } catch (unlinkError) {
            console.warn(`Konnte alte Download-Datei nicht löschen: ${currentDownload.DownloadURL}`, unlinkError);
          }
        }
        downloadURL = `/uploads/${downloadFile.filename}`;
      }

      const sql = 'UPDATE downloads SET Titel = ?, Beschreibung = ?, ShowcaseImageURL = ?, DownloadURL = ?, Reihenfolge = ?, ErstelltVon = ? WHERE DownloadID = ?';
      const [result] = await pool.query(sql, [title, description, showcaseImageURL, downloadURL, order, userId, downloadId]);

      if ((result as any).affectedRows === 0) {
        // Lösche hochgeladene Dateien, wenn der Download nicht gefunden wurde
        if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
        if (downloadFile) fs.unlinkSync(downloadFile.path);
        return res.status(404).json({ message: 'Download nicht gefunden.' });
      }
      return res.status(200).json({ message: 'Download erfolgreich aktualisiert.' });
    } catch (error) {
      console.error(`Fehler beim Aktualisieren von Download ${downloadId}:`, error);
      // Lösche hochgeladene Dateien bei Datenbankfehlern
      if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
      if (downloadFile) fs.unlinkSync(downloadFile.path);
      return res.status(500).json({ message: 'Serverfehler beim Aktualisieren.' });
    }
  });

  // DELETE /api/downloads/:id - Ein Download-Element löschen (und zugehörige Dateien)
  server.delete('/api/downloads/:id', async (req, res) => {
    const { id } = req.params;

    const downloadId = parseInt(id, 10);
    if (isNaN(downloadId)) {
      return res.status(400).send('Ungültige DownloadID.');
    }

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Dateipfade vor dem Löschen aus der DB abrufen
      const [filesToDelete] = await connection.query('SELECT ShowcaseImageURL, DownloadURL FROM downloads WHERE DownloadID = ?', [downloadId]);
      const filePaths = (filesToDelete as any[])[0];

      const [result] = await connection.query('DELETE FROM downloads WHERE DownloadID = ?', [downloadId]);

      if ((result as any).affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Download nicht gefunden.' });
      }

      // Dateien vom Server löschen
      if (filePaths) {
        if (filePaths.ShowcaseImageURL) {
          try {
            fs.unlinkSync(join(projectRoot, filePaths.ShowcaseImageURL));
          } catch (unlinkError) {
            console.warn(`Konnte Showcase-Datei nicht löschen: ${filePaths.ShowcaseImageURL}`, unlinkError);
          }
        }
        if (filePaths.DownloadURL) {
          try {
            fs.unlinkSync(join(projectRoot, filePaths.DownloadURL));
          } catch (unlinkError) {
            console.warn(`Konnte Download-Datei nicht löschen: ${filePaths.DownloadURL}`, unlinkError);
          }
        }
      }

      await connection.commit();
      return res.status(204).send(); // 204 No Content
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error(`Fehler beim Löschen von Download ${downloadId}:`, error);
      return res.status(500).json({ message: 'Serverfehler beim Löschen.' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });

  // PUT /api/downloads/reorder - Reihenfolge von Download-Elementen aktualisieren (für Drag & Drop)
  server.put('/api/downloads/reorder', async (req, res) => {
    let connection; // Declare connection outside try block
    const { orderUpdates } = req.body; // orderUpdates: [{ id: number, order: number }]

    if (!Array.isArray(orderUpdates) || orderUpdates.length === 0) {
      return res.status(400).json({ message: 'Ungültige Reihenfolge-Updates.' });
    }

    try {
      connection = await pool.getConnection(); // Assign here
      await connection.beginTransaction();

      for (const update of orderUpdates) {
        await connection.query('UPDATE downloads SET Reihenfolge = ? WHERE DownloadID = ?', [update.order, update.id]);
      }

      await connection.commit();
      return res.status(200).json({ message: 'Reihenfolge erfolgreich aktualisiert.' });
    } catch (error) {
      if (connection) { // Check if connection is defined before rollback
        await connection.rollback();
      }
      console.error('Fehler beim Aktualisieren der Reihenfolge der Downloads:', error);
      return res.status(500).json({ message: 'Serverfehler beim Aktualisieren der Reihenfolge.' });
    } finally {
      if (connection) { // Check if connection is defined before release
        connection.release();
      }
    }
  });


  // #############################################################
  // ##### BESTEHENDE ROUTEN (Posts, Kategorien, etc.)       #####
  // #############################################################

  // ... (Alle Ihre weiteren bestehenden Routen hier)
  // Content-Management Routen...
  server.get('/api/posts', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM beitraege order by BeitragsID DESC');
    return res.json(rows);
  });

  server.post('/api/posts', async (req, res) => {
    const { Titel, Inhalt, KategorieID, Bild, UserID} = req.body;
    const [result] = await pool.query('INSERT INTO beitraege (Titel, Inhalt, Bild, KategorieID, ErstelltVon, Erstellungsdatum) VALUES (?, ?, ?, ?, ?, NOW());', [Titel, Inhalt, Bild, KategorieID, UserID]);
    return res.status(201).json({ BeitragsID: (result as any).insertId, Titel, Inhalt, Bild, KategorieID, UserID });
  });

  server.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { Titel, Inhalt, KategorieID, Bild, UserID} = req.body;
    await pool.query('UPDATE beitraege SET Titel = ?, Inhalt = ?, Bild = ?, KategorieID = ?, ErstelltVon = ?, Aenderungsdatum = NOW() WHERE BeitragsID = ?', [Titel, Inhalt, Bild, KategorieID, UserID, id]);
    return res.json({ BeitragsID: id, Titel, Inhalt, Bild, KategorieID, UserID });
  });

  server.delete('/api/posts/:id', async (req, res) => {
    const beitragsID = parseInt(req.params.id, 10);  // parseInt direkt hier
    if (isNaN(beitragsID)) {
      return res.status(400).send('Ungültige BeitragsID.');
    }
    try {
      const [result] = await pool.query('DELETE FROM beitraege WHERE BeitragsID = ?', [beitragsID]);
      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ message: 'Beitrag nicht gefunden.' });
      }
      return res.status(204).send();  // 204 No Content für erfolgreichen Löschvorgang
    } catch (error) {
      console.error(`Fehler beim Löschen von Beitrag ${beitragsID}:`, error);
      return res.status(500).json({ message: 'Serverfehler beim Löschen.' });
    }
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
