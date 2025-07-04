import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import {fileURLToPath, pathToFileURL} from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

import mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  const commonEngine = new CommonEngine();

  const projectRoot = resolve(serverDistFolder, '../../../');
  dotenv.config({ path: join(projectRoot , 'data.env') });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use(cors());
  server.use(express.json());

  // Middleware für DevTools-Anfragen
  server.use((req, res, next) => {
    if (req.url.startsWith('/.well-known')) {
      return res.status(204).send();
    }
    // HIER IST DIE KORREKTUR:
    return next();
  });

  // ---- API-Routen ----
  const pool = mysql.createPool({
    host: process.env['DB_HOST'],
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  server.post('/api/auth/register', async (req, res) => {
    // Die neuen Felder aus dem Request-Body extrahieren
    const { vorname, nachname, email, password } = req.body;

    // Validierung der neuen Felder
    if (!vorname || !nachname || !email || !password) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);

      // Die SQL-Abfrage an die 'nutzer_daten'-Tabelle anpassen
      const query = 'INSERT INTO nutzer_daten (Vorname, Nachname, Email, Passwort, RoleID) VALUES (?, ?, ?, ?, ?)';

      // Annahme: Standard-Rolle ist 'user' mit der ID 1
      await pool.query(query, [vorname, nachname, email, passwordHash, 1]);

      return res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });
    } catch (error: any) {
      // Fehlerbehandlung für doppelte E-Mail-Adressen
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Diese E-Mail-Adresse ist bereits registriert.' });
      }
      console.error(error);
      return res.status(500).json({ message: 'Serverfehler bei der Registrierung.' });
    }
  });

  server.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Benutzername und Passwort sind erforderlich.' });
    }
    try {
      const query = `
        SELECT nd.NutzerID, nd.Email, nd.Passwort, rd.RollenName
        FROM nutzer_daten nd
               LEFT JOIN rollen_daten rd ON nd.RoleID = rd.RollenID
        WHERE nd.Email = ?`;
      const [rows] = await pool.query<mysql.RowDataPacket[]>(query, [username]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Ungültige Anmeldedaten.' });
      }
      const user = rows[0] as any;
      const isPasswordValid = await bcrypt.compare(password, user.Passwort);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Ungültige Anmeldedaten.' });
      }
      const token = jwt.sign(
        { id: user.NutzerID, role: user.RollenName.toLowerCase() },
        process.env['JWT_SECRET']!,
        { expiresIn: '1h' }
      );
      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Serverfehler beim Login.' });
    }
  });

  server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));

  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 3000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
