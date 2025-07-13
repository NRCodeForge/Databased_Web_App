import * as nodemailer from 'nodemailer';

/**
 * Nodemailer Transporter für den Versand von E-Mails.
 * 
 * Konfigurieren Sie hier Ihren SMTP-Server und Authentifizierungsdaten.
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Ersetzen Sie dies mit Ihrem SMTP-Host
  port: 587,
  secure: false, // true für Port 465, false für andere Ports
  auth: {
    user: 'your-email@example.com', // Ihre E-Mail-Adresse
    pass: 'your-password' // Ihr Passwort
  }
});

/**
 * Sendet eine E-Mail mit den angegebenen Empfänger-, Betreff- und Textdaten.
 *
 * @param {string} to - Die Empfängeradresse der E-Mail
 * @param {string} subject - Der Betreff der E-Mail
 * @param {string} text - Der Textinhalt der E-Mail
 * @returns {Promise<void>} Eine Promise, die beim Abschluss der E-Mail-Sendung aufgelöst wird
 */
export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  const mailOptions = {
    from: '"Schützenverein Huchting" <your-email@example.com>',
    to: to,
    subject: subject,
    text: text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-Mail gesendet: ' + info.response);
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
  }
}
