const { verify } = require("../service/OTPService");

exports.routes = (app, bot) => {
  console.log("otp routes ...");
  app.post("/v1/verifyotp", async (req, res) => {
    telegramid = req.body.telegramid;
    otp = req.body.otp;
    const data = await verify(telegramid, otp);
    console.log("data >>> OTP", data);
    if (data) {
      res.status(200);
      res.send({
        code: 200,
        status: "OK",
        data: data,
      });
      bot.sendMessage(
        telegramid,
        "your otp is : " + data.otp + " is successfully verified ..."
      );
    } else {
      res.status(200);
      res.send({
        code: 401,
        status: "Verification Failed",
      });
      bot.sendMessage(telegramid, " your otp verification failed ...");
    }
  });
};
