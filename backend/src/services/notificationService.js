import nodemailer from "nodemailer";

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

export async function sendNotification({ monitor, snapshot }) {
  const mailer = getTransporter();

  const recipientEmail = monitor.notifications?.email;

  if (!recipientEmail) {
    console.log("Monitor nema email adresu za obaveštenje.");
    return;
  }

  const subject = `PagePulse: promena na monitoru ${monitor.title}`;

  const text = [
    `Monitor: ${monitor.title}`,
    `URL: ${monitor.url}`,
    `Promena: ${snapshot.percentChange.toFixed(2)}%`,
    `Provereno: ${new Date(snapshot.checkedAt).toISOString()}`,
  ].join("\n");

  const info = await mailer.sendMail({
    from: process.env.SMTP_FROM,
    to: recipientEmail,
    subject,
    text,
  });

  console.log("Email uspešno poslat:", info.messageId);
}