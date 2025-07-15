import * as nodemailer from 'nodemailer';

/**
 * Nodemailer Transporter für den Versand von E-Mails.
 *
 * Konfigurieren Sie hier Ihren SMTP-Server und Authentifizierungsdaten.
 */
const transporter = nodemailer.createTransport({
  host: 'wp10428856.mailout.server-he.de', // Ersetzt mit dem ausgelesenen Host
  port: 465, // Verwendet Port 465 für SSL/TLS
  secure: true, // true für Port 465, false für andere Ports
  auth: {
    user: 'wp10428856-noreply', // Ihre E-Mail-Adresse
    pass: '11SvH_reply_!*' // Ihr Passwort
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
    from: '"Schützenverein Huchting" <noreply@schuetzenverein-huchting.de>',
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
