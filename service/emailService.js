const nodemailer = require("nodemailer");

let smtpTransport = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER_NAME,
      pass: process.env.GMAIL_USER_PASSWORD,
    },
  });

const sendEmail = (message, callback) => {
  smtpTransport().sendMail(message, (err, info) => {
    if (err) {
      if (typeof callback === "function") {
        callback(err);
      }
    } else if (typeof callback === "function") {
      callback(info);
    }
  });
};

const verifyEmail = (data) => {
  const message = {
    from: process.env.GMAIL_USER_NAME,
    to: data.email,
    subject: "OTP service",
    html: data.subject,
  };
  sendEmail(message, (msg) => console.log(msg));
};

const mailService = {
  sendEmail,
  verifyEmail,
};

module.exports = mailService;
