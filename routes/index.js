const { verify, sendotp } = require("../service/OTPService");

exports.routes = (app, bot) => {
  app.post("/v1/verifyotp", async (req, res) => {
    chatId = req.body.telegramId;
    otp = req.body.otp;
    const data = await verify(otp);
    //console.log("data >>> OTP", data.otp);
    if (data) {
      res.status(200);
      res.send({
        code: 200,
        status: "OK",
        data: {
          telegramId:data.telegramId,
          otp:data.otp
        },
      });
      bot.sendMessage(
        chatId,
        "your otp is : " + data.otp + " is successfully verified ..."
      );
    } else {
      res.status(200);
      res.send({
        code: 400,
        status: "Verification Failed",
      });
      bot.sendMessage(chatId, "your OTP :" + otp + " verification failed ...");
    }
  });

  app.post("/v1/getOTP", async (req, res) => {
    expiryTime = "";
    telegramid = req.body.telegramId;
    if (req.body.ttlTime) {
      expiryTime = req.body.ttlTime;
    }
    //console.log("in setTTL",expiryTime,telegramid)
    const data = await sendotp(telegramid, expiryTime);
    bot.sendMessage(telegramid, "your otp is :" + data + " kindly  verify ");
    if (data) {
      res.status(200);
      res.send({
        code: 200,
        status: "saved successfully",
        data: {
          otp: data,
        },
      });
    }
    else{
      res.status(200);
      res.send({
        code: 503,
        status: "Internal error",
      });
    }
  });
};
