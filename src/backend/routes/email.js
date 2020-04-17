import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function sendEmail(email, url) {
  let transporter = nodemailer.createTransport({
    host: "mail.fordas.pl",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: "forma_zakupy@fordas.pl",
    to: email,
    subject: "Email weryfikacyjny FormaZakupy",
    html: `Kliknij ten link aby aktywować konto: <a href="${url}">Link</a>`
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("Email wysłany");
    }
  });
}

export { sendEmail };
