const { verify, sendotp } = require("../service/OTPService");

const { success, error } = require("../helper/responseHelper");

exports.routes = (app, bot) => {
  app.post("/v1/verifyotp", async (req, res) => {
    chatId = req.body.telegramId;
    otp = req.body.otp;
    const data = await verify(otp);
    if (data) {
      success(res, 200, "OK", data);
      bot.sendMessage(chatId, "your otp is : " + otp + data.message);
    } else {
      error(res, "verification Failed", 200, 400);
      bot.sendMessage(chatId, "your OTP :" + otp + " verification failed ...");
    }
  });

  app.post("/v1/getOTP", async (req, res) => {
    expiryTime = "";
    telegramid = req.body.telegramId;
    if (req.body.ttlTime) {
      expiryTime = req.body.ttlTime;
    }
    const data = await sendotp(telegramid, expiryTime);
    bot.sendMessage(telegramid, "your otp is :" + data + " kindly  verify ");
    if (data) {
      success(res, 200, "OTP generated successfully", data);
    } else {
      error(res, "Internal Error ", 200, 503);
    }
  });
};
