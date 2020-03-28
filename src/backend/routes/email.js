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
    from: "poradnia",
    to: email,
    subject: "Confirm Email",
    html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error Occurs: ", err);
    } else {
      console.log("Email sent!!!");
    }
  });
}

export { sendEmail };
