import nodemailer from "nodemailer";
import messageTemplate from "./messageTemplate";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASS,
  },
});

export default async function sendEmail(email, code) {
  const message = `Password reset code: ${code}`;

  try {
    const mailOptions = {
      from: "Notifier",
      to: email,
      subject: "Notifier Password Recovery Code",
      text: message,
      html: messageTemplate(code),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
}
