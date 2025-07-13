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

// Multer für Dateiuploads
import multer from 'multer';
import fs from 'fs'; // Zum Erstellen von Verzeichnissen

/**
 * Erstellt und konfiguriert eine Express-Anwendung.
 * Diese Funktion richtet Middleware, API-Routen, Dateiuploads,
 * Datenbankverbindungen und Angular Universal für das serverseitige Rendering ein.
 *
 * @returns {express.Express} Die konfigurierte Express-Anwendungsinstanz.
 */
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  const commonEngine = new CommonEngine();

  // Lädt Umgebungsvariablen aus der data.env-Datei
  const projectRoot = resolve(serverDistFolder, '../../../');
  dotenv.config({ path: join(projectRoot, 'data.env') });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Standard-Middleware anwenden
  server.use(cors());
  server.use(express.json());

  /**
   * @description Datenbankverbindungspool für MySQL.
   * Verwendet Anmeldeinformationen aus den Umgebungsvariablen.
   */
  const pool = mysql.createPool({
    host: process.env['DB_HOST'],
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Statische Dateien aus dem Browser-Distributionsordner bereitstellen
  server.use(express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  /**
   * @description Multer-Konfiguration für die Handhabung von Dateiuploads.
   * Dateien werden im Verzeichnis 'uploads' im Projektstamm gespeichert.
   */
  const uploadsDir = join(projectRoot, 'uploads');
  // Erstelle das uploads-Verzeichnis, falls es nicht existiert
  if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  // Stelle das uploads-Verzeichnis statisch bereit, damit Dateien per URL zugänglich sind
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

  /**
   * @route POST /api/register
   * @description Registriert einen neuen Benutzer.
   * @param {object} req.body - Die Registrierungsdaten des Benutzers.
   * @param {string} req.body.email - Die E-Mail-Adresse des Benutzers.
   * @param {string} req.body.password - Das Passwort des Benutzers.
   * @param {string} req.body.vorname - Der Vorname des Benutzers.
   * @param {string} req.body.nachname - Der Nachname des Benutzers.
   * @returns {object} 201 - Erfolgsmeldung und die ID des neuen Benutzers.
   * @returns {object} 400 - Wenn Pflichtfelder fehlen.
   * @returns {object} 409 - Wenn bereits ein Benutzer mit der E-Mail existiert.
   * @returns {object} 500 - Serverfehler bei der Registrierung.
   */
  server.post('/api/register', async (req, res) => {
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
      const defaultRole = 1; // Standard-Rollen-ID
      const time = new Date().toISOString();
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

  /**
   * @route POST /api/send-email
   * @description Sendet eine E-Mail über den konfigurierten E-Mail-Dienst.
   * @param {object} req.body - Die E-Mail-Details.
   * @param {string} req.body.to - Die E-Mail-Adresse des Empfängers.
   * @param {string} req.body.subject - Der Betreff der E-Mail.
   * @param {string} req.body.text - Der Inhalt der E-Mail.
   * @returns {object} 200 - Erfolgsmeldung.
   * @returns {object} 400 - Wenn Pflichtfelder fehlen.
   * @returns {object} 500 - Serverfehler.
   */
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

  /**
   * @route POST /api/login
   * @description Authentifiziert einen Benutzer und gibt ein JWT zurück.
   * @param {object} req.body - Die Anmeldeinformationen.
   * @param {string} req.body.email - Die E-Mail des Benutzers.
   * @param {string} req.body.password - Das Passwort des Benutzers.
   * @returns {object} 200 - Das JWT für den authentifizierten Benutzer.
   * @returns {object} 401 - Ungültige Anmeldeinformationen.
   * @returns {object} 500 - Serverfehler.
   */
  server.post('/api/login', async (req, res) => {
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
  // ##### BENUTZERVERWALTUNGS-API-ROUTEN (ADMIN)             #####
  // #############################################################

  /**
   * @route GET /api/users
   * @description Ruft eine Liste aller Benutzer ab.
   * @returns {object[]} 200 - Ein Array von Benutzerobjekten.
   * @returns {object} 500 - Serverfehler.
   */
  server.get('/api/users', async (req, res) => {
    try {
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

  /**
   * @route POST /api/users
   * @description Erstellt einen neuen Benutzer (Admin-Aktion).
   * @param {object} req.body - Die Daten des neuen Benutzers.
   * @param {string} req.body.Vorname - Der Vorname des Benutzers.
   * @param {string} req.body.Nachname - Der Nachname des Benutzers.
   * @param {string} req.body.Email - Die E-Mail des Benutzers.
   * @param {string} req.body.Passwort - Das Passwort des Benutzers.
   * @param {number} req.body.RollenID - Die Rollen-ID des Benutzers.
   * @returns {object} 201 - Erfolgsmeldung und die ID des neuen Benutzers.
   * @returns {object} 400 - Wenn Pflichtfelder fehlen.
   * @returns {object} 500 - Serverfehler.
   */
  server.post('/api/users', async (req, res) => {
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

  /**
   * @route PUT /api/users/:id
   * @description Aktualisiert die Informationen eines bestehenden Benutzers.
   * @param {string} req.params.id - Die ID des zu aktualisierenden Benutzers.
   * @param {object} req.body - Die zu aktualisierenden Benutzerdaten. Kann optional ein neues Passwort enthalten.
   * @returns {object} 200 - Erfolgsmeldung.
   * @returns {object} 400 - Wenn die Benutzer-ID ungültig ist.
   * @returns {object} 500 - Serverfehler.
   */
  server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { Vorname, Nachname, Email, RollenID, Passwort } = req.body;

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).send('Ungültige UserID.');
    }

    try {
      if (Passwort && Passwort.length > 0) {
        const hashedPassword = await bcrypt.hash(Passwort, 10);
        await pool.query(
          'UPDATE benutzer SET Vorname = ?, Nachname = ?, Email = ?, RollenID = ?, Passwort = ? WHERE BenutzerID = ?',
          [Vorname, Nachname, Email, RollenID, hashedPassword, userId]
        );
      } else {
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

  /**
   * @route DELETE /api/users/:id
   * @description Löscht einen Benutzer.
   * @param {string} req.params.id - Die ID des zu löschenden Benutzers.
   * @returns {void} 204 - Kein Inhalt, was die erfolgreiche Löschung anzeigt.
   * @returns {object} 400 - Wenn die Benutzer-ID ungültig ist.
   * @returns {object} 404 - Wenn der Benutzer nicht gefunden wird.
   * @returns {object} 500 - Serverfehler.
   */
  server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).send('Ungültige UserID.');
    }

    try {
      const [result] = await pool.query('DELETE FROM benutzer WHERE BenutzerID = ?', [userId]);
      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error(`Fehler beim Löschen von Benutzer ${userId}:`, error);
      return res.status(500).json({ message: 'Serverfehler beim Löschen.' });
    }
  });

  /**
   * @route POST /api/track-view
   * @description Verfolgt einen Seitenaufruf für Analysezwecke.
   * @param {object} req.body - Der Anfragekörper.
   * @param {string} req.body.path - Der Pfad der aufgerufenen Seite.
   * @returns {object} 201 - Erfolgsmeldung.
   * @returns {object} 400 - Wenn der Pfad fehlt.
   * @returns {object} 500 - Serverfehler.
   */
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

  /**
   * @route GET /api/page-views
   * @description Ruft aggregierte Seitenaufrufdaten für die letzten 30 Tage ab.
   * @returns {object[]} 200 - Ein Array von Objekten, die jeweils ein Datum ('Tag') und die Anzahl der Aufrufe ('Aufrufe') enthalten.
   * @returns {object} 500 - Serverfehler.
   */
  server.get('/api/page-views', async (req, res) => {
    try {
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

  /**
   * @route GET /api/beitraege
   * @description Ruft Beiträge nach Kategorie-ID ab.
   * @param {string} req.query.kategorieId - Die ID der Kategorie.
   * @returns {object[]} 200 - Ein Array von Beitragsobjekten.
   * @returns {object} 400 - Wenn die Kategorie-ID ungültig ist.
   * @returns {object} 500 - Datenbankfehler.
   */
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
  // ##### DOWNLOADS-API-ROUTEN                             #####
  // #############################################################

  /**
   * @route GET /api/downloads
   * @description Ruft alle Download-Elemente ab, sortiert nach ihrer Reihenfolge.
   * @returns {object[]} 200 - Ein Array von Download-Elementen.
   * @returns {object} 500 - Serverfehler.
   */
  server.get('/api/downloads', async (req, res) => {
    try {
      const [downloads] = await pool.query('SELECT DownloadID AS id, Titel AS title, Beschreibung AS description, ShowcaseImageURL AS showcaseImage, DownloadURL AS downloadUrl, Reihenfolge AS `order` FROM downloads ORDER BY Reihenfolge ASC, DownloadID DESC');
      return res.json(downloads);
    } catch (error) {
      console.error('Fehler beim Abrufen der Downloads:', error);
      return res.status(500).json({ message: 'Serverfehler' });
    }
  });

  /**
   * @route POST /api/downloads
   * @description Erstellt ein neues Download-Element mit Dateiuploads.
   * @param {object} req - Die multipart/form-data Anfrage.
   * @param {string} req.body.title - Der Titel des Downloads.
   * @param {string} [req.body.description] - Die Beschreibung des Downloads.
   * @param {string} req.body.userId - Die ID des Benutzers, der den Download erstellt.
   * @param {File} req.files.showcaseImage - Die optionale Vorschaubild-Datei.
   * @param {File} req.files.downloadFile - Die erforderliche Download-Datei.
   * @returns {object} 201 - Erfolgsmeldung und die ID des neuen Downloads.
   * @returns {object} 400 - Wenn erforderliche Felder oder Dateien fehlen.
   * @returns {object} 500 - Serverfehler.
   */
  server.post('/api/downloads', upload.fields([
    { name: 'showcaseImage', maxCount: 1 },
    { name: 'downloadFile', maxCount: 1 }
  ]), async (req, res) => {
    const { title, description, userId } = req.body;
    const showcaseImageFile = (req.files as any)?.showcaseImage?.[0];
    const downloadFile = (req.files as any)?.downloadFile?.[0];

    if (!title || !userId || !downloadFile) {
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
      if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
      if (downloadFile) fs.unlinkSync(downloadFile.path);
      return res.status(500).json({ message: 'Serverfehler beim Erstellen des Downloads.' });
    }
  });

  /**
   * @route PUT /api/downloads/:id
   * @description Aktualisiert ein bestehendes Download-Element, mit optionalem Dateiaustausch.
   * @param {string} req.params.id - Die ID des zu aktualisierenden Downloads.
   * @param {object} req - Die multipart/form-data Anfrage.
   * @returns {object} 200 - Erfolgsmeldung.
   * @returns {object} 400 - Ungültige Download-ID.
   * @returns {object} 404 - Download nicht gefunden.
   * @returns {object} 500 - Serverfehler.
   */
  server.put('/api/downloads/:id', upload.fields([
    { name: 'showcaseImage', maxCount: 1 },
    { name: 'downloadFile', maxCount: 1 }
  ]), async (req, res) => {
    const { id } = req.params;
    const { title, description, order, userId } = req.body;
    const showcaseImageFile = (req.files as any)?.showcaseImage?.[0];
    const downloadFile = (req.files as any)?.downloadFile?.[0];

    const downloadId = parseInt(id, 10);
    if (isNaN(downloadId)) {
      if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
      if (downloadFile) fs.unlinkSync(downloadFile.path);
      return res.status(400).send('Ungültige DownloadID.');
    }

    try {
      const [currentDownloads] = await pool.query('SELECT ShowcaseImageURL, DownloadURL FROM downloads WHERE DownloadID = ?', [downloadId]);
      const currentDownload = (currentDownloads as any[])[0];

      let showcaseImageURL = req.body.showcaseImage;
      let downloadURL = req.body.downloadUrl;

      if (showcaseImageFile) {
        if (currentDownload && currentDownload.ShowcaseImageURL) {
          try {
            fs.unlinkSync(join(projectRoot, currentDownload.ShowcaseImageURL));
          } catch (unlinkError) {
            console.warn(`Konnte alte Showcase-Datei nicht löschen: ${currentDownload.ShowcaseImageURL}`, unlinkError);
          }
        }
        showcaseImageURL = `/uploads/${showcaseImageFile.filename}`;
      }

      if (downloadFile) {
        if (currentDownload && currentDownload.DownloadURL) {
          try {
            fs.unlinkSync(join(projectRoot, currentDownload.DownloadURL));
          } catch (unlinkError) {
            console.warn(`Konnte alte Download-Datei nicht löschen: ${currentDownload.DownloadURL}`, unlinkError);
          }
        }
        downloadURL = `/uploads/${downloadFile.filename}`;
      }

      const sql = 'UPDATE downloads SET Titel = ?, Beschreibung = ?, ShowcaseImageURL = ?, DownloadURL = ?, Reihenfolge = ?, ErstelltVon = ? WHERE DownloadID = ?';
      const [result] = await pool.query(sql, [title, description, showcaseImageURL, downloadURL, order, userId, downloadId]);

      if ((result as any).affectedRows === 0) {
        if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
        if (downloadFile) fs.unlinkSync(downloadFile.path);
        return res.status(404).json({ message: 'Download nicht gefunden.' });
      }
      return res.status(200).json({ message: 'Download erfolgreich aktualisiert.' });
    } catch (error) {
      console.error(`Fehler beim Aktualisieren von Download ${downloadId}:`, error);
      if (showcaseImageFile) fs.unlinkSync(showcaseImageFile.path);
      if (downloadFile) fs.unlinkSync(downloadFile.path);
      return res.status(500).json({ message: 'Serverfehler beim Aktualisieren.' });
    }
  });

  /**
   * @route DELETE /api/downloads/:id
   * @description Löscht ein Download-Element und die zugehörigen Dateien vom Server.
   * @param {string} req.params.id - Die ID des zu löschenden Downloads.
   * @returns {void} 204 - Kein Inhalt, was die erfolgreiche Löschung anzeigt.
   * @returns {object} 400 - Ungültige Download-ID.
   * @returns {object} 404 - Download nicht gefunden.
   * @returns {object} 500 - Serverfehler.
   */
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

      const [filesToDelete] = await connection.query('SELECT ShowcaseImageURL, DownloadURL FROM downloads WHERE DownloadID = ?', [downloadId]);
      const filePaths = (filesToDelete as any[])[0];

      const [result] = await connection.query('DELETE FROM downloads WHERE DownloadID = ?', [downloadId]);

      if ((result as any).affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Download nicht gefunden.' });
      }

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
      return res.status(204).send();
    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`Fehler beim Löschen von Download ${downloadId}:`, error);
      return res.status(500).json({ message: 'Serverfehler beim Löschen.' });
    } finally {
      if (connection) connection.release();
    }
  });

  /**
   * @route PUT /api/downloads/reorder
   * @description Aktualisiert die Anzeigereihenfolge mehrerer Download-Elemente.
   * @param {object} req.body - Der Anfragekörper.
   * @param {Array<{id: number, order: number}>} req.body.orderUpdates - Ein Array von Objekten, die jeweils eine Download-ID und ihre neue Reihenfolge enthalten.
   * @returns {object} 200 - Erfolgsmeldung.
   * @returns {object} 400 - Wenn die Update-Daten ungültig sind.
   * @returns {object} 500 - Serverfehler.
   */
  server.put('/api/downloads/reorder', async (req, res) => {
    let connection;
    const { orderUpdates } = req.body;

    if (!Array.isArray(orderUpdates) || orderUpdates.length === 0) {
      return res.status(400).json({ message: 'Ungültige Reihenfolge-Updates.' });
    }

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      for (const update of orderUpdates) {
        await connection.query('UPDATE downloads SET Reihenfolge = ? WHERE DownloadID = ?', [update.order, update.id]);
      }

      await connection.commit();
      return res.status(200).json({ message: 'Reihenfolge erfolgreich aktualisiert.' });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Fehler beim Aktualisieren der Reihenfolge der Downloads:', error);
      return res.status(500).json({ message: 'Serverfehler beim Aktualisieren der Reihenfolge.' });
    } finally {
      if (connection) connection.release();
    }
  });

  // #############################################################
  // ##### BESTEHENDE CONTENT-MANAGEMENT-ROUTEN (Beiträge etc.) #####
  // #############################################################

  /**
   * @route GET /api/posts
   * @description Ruft alle Beiträge ab, sortiert nach den neuesten zuerst.
   * @returns {object[]} 200 - Ein Array aller Beitragsobjekte.
   */
  server.get('/api/posts', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM beitraege order by BeitragsID DESC');
    return res.json(rows);
  });

  /**
   * @route POST /api/posts
   * @description Erstellt einen neuen Beitrag.
   * @param {object} req.body - Die Beitragsdaten.
   * @returns {object} 201 - Das neu erstellte Beitragsobjekt.
   */
  server.post('/api/posts', async (req, res) => {
    const { Titel, Inhalt, KategorieID, Bild, UserID} = req.body;
    const [result] = await pool.query('INSERT INTO beitraege (Titel, Inhalt, Bild, KategorieID, ErstelltVon, Erstellungsdatum) VALUES (?, ?, ?, ?, ?, NOW());', [Titel, Inhalt, Bild, KategorieID, UserID]);
    return res.status(201).json({ BeitragsID: (result as any).insertId, Titel, Inhalt, Bild, KategorieID, UserID });
  });

  /**
   * @route PUT /api/posts/:id
   * @description Aktualisiert einen bestehenden Beitrag.
   * @param {string} req.params.id - Die ID des zu aktualisierenden Beitrags.
   * @param {object} req.body - Die aktualisierten Beitragsdaten.
   * @returns {object} 200 - Das aktualisierte Beitragsobjekt.
   */
  server.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { Titel, Inhalt, KategorieID, Bild, UserID} = req.body;
    await pool.query('UPDATE beitraege SET Titel = ?, Inhalt = ?, Bild = ?, KategorieID = ?, ErstelltVon = ?, Aenderungsdatum = NOW() WHERE BeitragsID = ?', [Titel, Inhalt, Bild, KategorieID, UserID, id]);
    return res.json({ BeitragsID: id, Titel, Inhalt, Bild, KategorieID, UserID });
  });

  /**
   * @route DELETE /api/posts/:id
   * @description Löscht einen Beitrag.
   * @param {string} req.params.id - Die ID des zu löschenden Beitrags.
   * @returns {void} 204 - Kein Inhalt, was die erfolgreiche Löschung anzeigt.
   * @returns {object} 400 - Ungültige Beitrags-ID.
   * @returns {object} 404 - Beitrag nicht gefunden.
   * @returns {object} 500 - Serverfehler.
   */
  server.delete('/api/posts/:id', async (req, res) => {
    const beitragsID = parseInt(req.params.id, 10);
    if (isNaN(beitragsID)) {
      return res.status(400).send('Ungültige BeitragsID.');
    }
    try {
      const [result] = await pool.query('DELETE FROM beitraege WHERE BeitragsID = ?', [beitragsID]);
      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ message: 'Beitrag nicht gefunden.' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error(`Fehler beim Löschen von Beitrag ${beitragsID}:`, error);
      return res.status(500).json({ message: 'Serverfehler beim Löschen.' });
    }
  });

  /**
   * @route GET /api/categories
   * @description Ruft alle Kategorien ab.
   * @returns {object[]} 200 - Ein Array von Kategorieobjekten.
   */
  server.get('/api/categories', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM kategorien');
    return res.json(rows);
  });

  /**
   * @route GET /api/departments
   * @description Ruft alle Abteilungen ab.
   * @returns {object[]} 200 - Ein Array von Abteilungsobjekten.
   */
  server.get('/api/departments', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM abteilungen');
    return res.json(rows);
  });

  /**
   * @description Fängt alle Anfragen ab, die nicht von einer API-Route behandelt wurden,
   * und rendert die Angular-Anwendung serverseitig mit Universal.
   * Dies ist entscheidend für SEO und die initiale Ladeleistung.
   */
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

/**
 * Startet den Express-Server und lässt ihn auf dem konfigurierten Port lauschen.
 * Der Port wird aus der Umgebungsvariable 'PORT' gelesen, andernfalls wird 4200 verwendet.
 *
 * @returns {void}
 */
function run(): void {
  const port = process.env['PORT'] || 4200;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Startet die Anwendung
run();