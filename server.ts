import { APP_BASE_HREF } from '@angular/common';
// HIER IST DIE KORREKTE IMPORT-ZEILE
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// Importe für die API-Logik
import mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

// Die Express-App wird exportiert, um sie z.B. für Serverless Functions zu nutzen
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Middleware
  dotenv.config();
  server.use(cors());
  server.use(express.json());

  // ---- Korrigierte API-Routen ----
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
    const { username, password, role = 'user' } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Benutzername und Passwort sind erforderlich.' });
    }
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO nutzer_daten (Email, Passwort, RoleID) VALUES (?, ?, ?)';
      await pool.query(query, [username, passwordHash, 1]); // Annahme: RoleID 1 ist 'user'
      return res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Dieser Benutzername ist bereits vergeben.' });
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

  // Statische Dateien aus dem `browser`-Ordner bereitstellen
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // Alle anderen Routen an die Angular-Engine übergeben
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

  // Node-Server starten
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Starten der Anwendung
run();
