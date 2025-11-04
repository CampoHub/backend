const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

console.log('API Key:', process.env.MAILERSEND_API_KEY);
console.log('FROM Email:', process.env.FROM_EMAIL);

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

async function sendEmail({to, subject, html}) {
  console.log('Iniciando envío de correo...');
  console.log('Destinatario:', to);
  console.log('Asunto:', subject);
  
  try {
    console.log('Creando sender...');
    const sentFrom = new Sender(process.env.FROM_EMAIL, "Sistema");
    console.log('Sender creado:', sentFrom);

    console.log('Creando recipient...');
    const recipients = [ new Recipient(to, "") ];
    console.log('Recipients creados:', recipients);

    console.log('Configurando parámetros del email...');
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html);
    console.log('Parámetros configurados');

    console.log('Enviando email...');
    await mailersend.email.send(emailParams);
    console.log('Email enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw error;
  }
}

module.exports = { sendEmail };
