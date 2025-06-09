import express, { Request, Response } from 'express';
import path from 'path';
import mysql from 'mysql2/promise'; // MySQL-Bibliothek für Promises
import bcrypt from 'bcrypt';       // Für die Passwortverschlüsselung

import jwt from 'jsonwebtoken';    // Für JSON Web Tokens
import cors from 'cors';           // Um Cross-Origin-Anfragen zu erlauben

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // CORS für alle Routen aktivieren
app.use(express.json()); // Body-Parser für JSON-Anfragen
app.use(express.static(path.join(__dirname, '../dist/databased-web-app/browser')));

// --- Datenbankverbindung ---
// Verwenden Sie Umgebungsvariablen für die Sicherheit in einer echten Anwendung!
const dbConfig = {
  host: 'localhost',
  user: 'root', // Ihr DB-Benutzer
  password: '', // Ihr DB-Passwort
  database: 'schuetzenverein'
};

// Erstellen Sie einen Verbindungspool
const pool = mysql.createPool(dbConfig);

const JWT_SECRET = 'Ihr_super_geheimer_schluessel_der_sehr_lang_ist'; // Ändern Sie dies!

// =================================================================
// API-Routen für Authentifizierung
// =================================================================

// ### REGISTRIERUNGS-ROUTE ###
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Benutzername, E-Mail und Passwort sind erforderlich.' });
  }

  try {
    // 1. Passwort hashen
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 2. Neuen Benutzer in die Datenbank einfügen
    const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    await pool.query(query, [username, email, password_hash]);

    res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });

  } catch (error: any) {
    // Fehlerbehandlung für doppelte Einträge
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Benutzername oder E-Mail bereits vergeben.' });
    }
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ message: 'Serverfehler bei der Registrierung.' });
  }
});

// ### LOGIN-ROUTE ###
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'E-Mail/Benutzername und Passwort sind erforderlich.' });
  }

  try {
    // 1. Benutzer in der Datenbank finden (anhand von E-Mail oder Benutzername)
    const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
    const [rows] = await pool.query(query, [emailOrUsername, emailOrUsername]);

    // @ts-ignore
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten.' });
    }

    // @ts-ignore
    const user = rows[0];

    // 2. Passwörter vergleichen
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten.' });
    }

    // 3. JWT erstellen
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' } // Token ist 1 Stunde gültig
    );

    // 4. Token und Benutzerinformationen an das Frontend senden
    res.json({
      message: 'Login erfolgreich.',
      token,
      userId: user.id,
      role: user.role
    });

  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({ message: 'Serverfehler beim Login.' });
  }
});


// --- Angular Fallback-Route ---
// Alle anderen Anfragen werden an die Angular-App weitergeleitet
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/databased-web-app/browser/index.html'));
});


app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
