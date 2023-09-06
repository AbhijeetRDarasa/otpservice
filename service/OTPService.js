const {
  getSchema,
  setexpiryTime,
  getModel,
} = require("../model/OTP");
const moment = require("moment");
const mongoose = require("mongoose");

exports.sendotp = async (telegramId, expiryTime) => {
  try {
    console.log("in the sendOTP");
    //var otp = generateOTP();
    const data = await setTTL(expiryTime, telegramId);
    console.log("in the sendOTP");
    return data.otp;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

exports.verify = async (otp) => {
  try {
    console.log("in the verify");
    const Schema = getSchema(null);

    const OTP = mongoose.models.OTP || mongoose.model("OTP", Schema);

    const data = await OTP.findOne({
      otp: otp,
    });
    console.log("in the verify", data);
    return data;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

setTTL = async (expiryTime, telegramId) => {
  try {
    //console.log("in SETTTL ..")
    const otp = generateOTP();
    const data = await saveData(telegramId, otp, expiryTime);
    return data;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

async function saveData(telegramId, otp, expiryTime) {
  //console.log("sendOtpToTelegram", telegramId, otp);
  const Schema = getSchema(expiryTime);

  const OTP = mongoose.models.OTP || mongoose.model("OTP", Schema);
  var otpData = new OTP({
    telegramId: telegramId,
    otp: otp,
  });
  const data = await otpData.save();
  console.log("data saved sucessfully", data);
  return data;
}
