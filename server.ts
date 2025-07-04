import express, { Request, Response } from 'express';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
// KORREKTUR: Zugriff auf process.env mit eckigen Klammern
const port = process.env['PORT'] || 3306;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/databased-web-app/browser')));

const dbConfig = {
  host: 'localhost',
  user: 'sv_host',
  password: '$N_DB_JE%(NBD',
  database: 'schuetzenverein_db'
};

const pool = mysql.createPool(dbConfig);
const JWT_SECRET = 'Ihr_super_geheimer_schluessel_der_sehr_lang_ist';

// ### REGISTRIERUNGS-ROUTE ###
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    // KORREKTUR: return hinzugefügt
    return res.status(400).json({ message: 'Benutzername, E-Mail und Passwort sind erforderlich.' });
  }

  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    await pool.query(query, [username, email, password_hash]);

    // KORREKTUR: return hinzugefügt
    return res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });

  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Benutzername oder E-Mail bereits vergeben.' });
    }
    console.error('Registrierungsfehler:', error);
    // KORREKTUR: return hinzugefügt
    return res.status(500).json({ message: 'Serverfehler bei der Registrierung.' });
  }
});

// ### LOGIN-ROUTE ###
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'E-Mail/Benutzername und Passwort sind erforderlich.' });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
    const [rows] = await pool.query(query, [emailOrUsername, emailOrUsername]);

    // @ts-ignore
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten.' });
    }

    // @ts-ignore
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // KORREKTUR: return hinzugefügt
    return res.json({
      message: 'Login erfolgreich.',
      token,
      userId: user.id,
      role: user.role
    });

  } catch (error) {
    console.error('Login-Fehler:', error);
    return res.status(500).json({ message: 'Serverfehler beim Login.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/databased-web-app/browser/index.html'));
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
