const { verify, sendotp } = require("../service/OTPService");

const { success, error } = require("../helper/responseHelper");

const { sendVerifyEmail} = require('../service/emailService')

exports.routes = (app, bot) => {
  app.post("/v1/verifyotp", async (req, res) => {
    chatId = req.body.telegramId;
    otp = req.body.otp;
    const data = await verify(otp);
    if (data) {
      success(res, 200, "OK", data);
      bot.sendMessage(chatId, "your otp is : " + otp + data.message);
      const message = {"email": emailId, "subject": data.message}
      sendVerifyEmail(message);
    } else {
      error(res, "verification Failed", 200, 400);
      bot.sendMessage(chatId, "your OTP :" + otp + " verification failed ...");
    }
  });

  app.post("/v1/getOTP", async (req, res) => {
    expiryTime = "";
    telegramid = req.body.telegramId;
    emailId = req.body.email;
    if (req.body.ttlTime) {
      expiryTime = req.body.ttlTime;
    }
    const data = await sendotp(telegramid, emailId, expiryTime);
    bot.sendMessage(telegramid, "your otp is :" + data + " kindly  verify ");
    console.log("get OTP ....")
    if (data) {
      console.log("data otp");
      success(res, 200, "OTP generated successfully", data);
      const message = {"email": emailId, "subject":"your otp is :" + data + " kindly  verify " }
      sendVerifyEmail(message);
    } else {
      error(res, "Internal Error ", 200, 503);
    }
  });
};
