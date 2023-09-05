const OTP = require("../model/OTP");

exports.sendotp = async (telegramId) => {
  try {
    console.log("in the sendOTP");
    var otp = generateOTP();
    const data = saveData(telegramId, otp);
    console.log("in the sendOTP");
    return data;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

exports.verify = async (telegramId, otp) => {
  try {
    console.log(telegramId, otp);
    console.log("in the verify");

    const data = await OTP.findOne({
      telegramId: telegramId,
      otp: otp,
    });
    console.log("in the verify", data);
    return data;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

async function saveData(telegramId, otp) {
  console.log("sendOtpToTelegram", telegramId, otp);
  var otpData = new OTP({
    telegramId: telegramId,
    otp: otp,
  });
  const data = await otpData.save();
  console.log("data saved sucessfully", data);
  return data;
}
