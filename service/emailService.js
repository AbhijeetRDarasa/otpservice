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
  //console.log("sendmail", message);
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

const verifyThroughEmail = (data) => {
  //console.log("email data", data);
  const message = {
    from: process.env.GMAIL_USER_NAME,
    to: "abhi.mca50@gmail.com",
    subject: "OTP service",
    html: data.subject,
  };
  sendEmail(message, (msg) => console.log(msg));
};

const mailService = {
  sendEmail,
  verifyThroughEmail,
};

module.exports = mailService;
