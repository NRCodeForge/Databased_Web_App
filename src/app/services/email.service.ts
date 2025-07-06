import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Ersetzen Sie dies mit Ihrem SMTP-Host
  port: 587,
  secure: false, // true für Port 465, false für andere Ports
  auth: {
    user: 'your-email@example.com', // Ihre E-Mail-Adresse
    pass: 'your-password' // Ihr Passwort
  }
});

export async function sendMail(to: string, subject: string, text: string) {
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
