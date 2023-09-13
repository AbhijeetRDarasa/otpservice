const { verify, sendotp } = require("../service/OTPService");

const { success, error } = require("../helper/responseHelper");

const { verifyThroughEmail } = require("../service/emailService");

exports.routes = (app, bot) => {
  app.post("/v1/verifyOTPByTelegramId", async (req, res) => {
    chatId = req.body.telegramId;
    otp = req.body.otp;
    try {
      const data = await verify(otp);
      if (data.success !== false) {
        success(res, 200, "OK", data);
        bot.sendMessage(chatId, "your otp is : " + otp + data.message);
      } else {
        error(res, "verification Failed", 200, 400);
        bot.sendMessage(
          chatId,
          "your OTP :" + otp + " verification failed ..."
        );
      }
    } catch (error) {
      error(res, "verification Failed", 200, 400);
    }
  });

  app.post("/v1/getOTP", async (req, res) => {
    expiryTime = "";
    telegramId = req.body.telegramId;
    emailId = req.body.emailId;
    if (req.body.ttlTime) {
      expiryTime = req.body.ttlTime;
    }
    const data = await sendotp(telegramId, emailId, expiryTime);
    if (telegramId)
      bot.sendMessage(telegramId, "your otp is :" + data + " kindly  verify ");
    if (data.success !== false) {
      success(res, 200, "OTP generated successfully", data);
      const message = {
        email: emailId,
        subject: "your otp is :" + data.otp + " kindly  verify ",
      };
      verifyThroughEmail(message);
    } else {
      error(res, "Internal Error ", 200, 503);
    }
  });

  app.post("/v1/verifyOTPByEmailId", async (req, res) => {
    emailId = req.body.emailId;
    otp = req.body.otp;
    try {

    const data = await verify(otp);
    if (data.success !== false) {
      success(res, 200, "OK", data);
      const message = { email: emailId, subject: data.message };
      verifyThroughEmail(message);
    } else {
      error(res, "verification Failed", 200, 400);
      bot.sendMessage(chatId, "your OTP :" + otp + " verification failed ...");
    }
  }
  catch(err){
    error(res, "verification Failed", 200, 400);
  }
  });
};
