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

  const pool = mysql.createPool({
    host: process.env['DB_HOST'],
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Bestehende API-Routen...

  // Neue API-Routen für Content-Management
  server.get('/api/posts', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM beitrags_daten');
    res.json(rows);
  });

  server.post('/api/posts', async (req, res) => {
    const { Titel, Inhalt, KategorieID } = req.body;
    const [result] = await pool.query('INSERT INTO beitrags_daten (Titel, Inhalt, KategorieID, Erstellungsdatum) VALUES (?, ?, ?, NOW())', [Titel, Inhalt, KategorieID]);
    res.status(201).json({ BeitragsID: (result as any).insertId, Titel, Inhalt, KategorieID });
  });

  server.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { Titel, Inhalt, KategorieID } = req.body;
    await pool.query('UPDATE beitrags_daten SET Titel = ?, Inhalt = ?, KategorieID = ?, Aenderungsdatum = NOW() WHERE BeitragsID = ?', [Titel, Inhalt, KategorieID, id]);
    res.json({ BeitragsID: id, Titel, Inhalt, KategorieID });
  });

  server.get('/api/categories', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM kategorie_daten');
    res.json(rows);
  });

  // Neue API-Routen für Abteilungen
  server.get('/api/departments', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM abteilungs_daten');
    res.json(rows);
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
