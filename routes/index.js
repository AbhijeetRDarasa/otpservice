const { verify, sendotp } = require("../service/OTPService");

const { success, error } = require("../helper/responseHelper");

const { verifyEmail } = require("../service/emailService");

exports.routes = (app, bot) => {
  app.post("/v1/verifyOTPByTelegramId", async (req, res) => {
    telegramId = req.body.telegramId;
    otp = req.body.otp;
    try {
      if (telegramId) {
        const data = await verify(otp, null, telegramId);
        if (data.success !== false) {
          success(res, 200, data.message, data.otp);
          bot.sendMessage(telegramId, "your otp is : " + otp + data.message);
        } else {
          error(res, data.message, 200, data.code);
          //if you need to notify back through telegramid
          // bot.sendMessage(
          //   telegramId,
          //   "your OTP :" + otp + data.message
          // );
        }
      } else {
        error(res, "please provide valid telegram id ", 200, 400);
      }
    } catch (err) {
      error(res, "verification Failed", 200, 400);
    }
  });

  app.post("/v1/getOTP", async (req, res) => {
    console.log("in get OTP", req);
    expiryTime = "";
    telegramId = req.body.telegramId;
    emailId = req.body.emailId;
    try {
      if (req.body.ttlTime) {
        expiryTime = req.body.ttlTime;
      }
      const data = await sendotp(telegramId, emailId, expiryTime);
      if (telegramId)
        bot.sendMessage(
          telegramId,
          "your otp is : " + data.otp + " kindly  verify "
        );
      if (data.success !== false) {
        success(res, 200, "OTP generated successfully", data.otp);
        if (emailId) {
          const message = {
            email: emailId,
            subject: "your otp is : " + data.otp + " kindly  verify ",
          };
          verifyEmail(message);
        }
      } else {
        error(res, "Internal Error ", 200, 503);
      }
    } catch (err) {
      console.log("err", err);
      error(res, "Failed to generate OTP ", 200, 503);
    }
  });

  app.post("/v1/verifyOTPByEmailId", async (req, res) => {
    emailId = req.body.emailId;
    otp = req.body.otp;
    try {
      if (emailId) {
        const data = await verify(otp, emailId, null);
        if (data.success !== false) {
          success(res, 200, data.message, data.otp);
          const message = { email: emailId, subject: data.message };
          //if you want to send an OTP verified email
          //verifyEmail(message);
        } else {
          error(res, data.message, 200, data.code);
        }
      } else {
        error(res, "please provide valid email id ", 200, 400);
      }
    } catch (err) {
      error(res, "verification Failed", 200, 400);
    }
  });
};
