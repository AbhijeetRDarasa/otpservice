const nodemailer = require('nodemailer');

let createTransport = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER_NAME,
        pass: process.env.GMAIL_USER_PASSWORD
    },
});

const sendMail = (message, callback) => {
    console.log("sendmail", message)
    createTransport().sendMail(message, (err, info) => {
        if (err) {
            if (typeof callback === 'function') {
                callback(err);
            }
        } else if (typeof callback === 'function') {
            callback(info);
        }
    });
};


const sendVerifyEmail = (data ) => {
 console.log("email data",data);
    const message = {
        from: process.env.GMAIL_USER_NAME,
        to:'abhi.mca50@gmail.com',
        subject: "OTP service",
        html: data.subject
    };
    sendMail(message, msg => console.log(msg));
};


const mailService = {
    createTransport,
    sendMail,
    sendVerifyEmail
};

module.exports = mailService;
