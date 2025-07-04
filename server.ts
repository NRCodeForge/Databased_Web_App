import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {Query} from "mysql2";

// Diese Zeilen stellen die fehlenden __filename und __dirname Variablen bereit
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// KORREKTUR: Klammer-Notation für alle process.env-Aufrufe
const pool = mysql.createPool({
  host: process.env['DB_HOST'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

interface User {
  id: number;
  username: string;
  password_hash: string;
  role: 'user' | 'admin' | 'leader';
}

app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { username, password, role = 'user' } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Benutzername und Passwort sind erforderlich.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)';
    await pool.query(query, [username, passwordHash, role]);
    return res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Benutzername bereits vergeben.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Serverfehler bei der Registrierung.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Benutzername und Passwort sind erforderlich.' });
  }

  try {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await pool.query<mysql.RowDataPacket[]>(query, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten.' });
    }

    const user = rows[0] as User;

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten.' });
    }

    // KORREKTUR: Klammer-Notation für process.env
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env['JWT_SECRET']!,
      { expiresIn: '1h' }
    );

    return res.json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Serverfehler beim Login.' });
  }
});


const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
