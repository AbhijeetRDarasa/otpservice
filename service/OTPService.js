const { generateOTP } = require("../helper/otpGenerator");
const { getSchema } = require("../model/OTP");

const mongoose = require("mongoose");

exports.sendotp = async (telegramId, expiryTime) => {
  try {
    const data = await setTTL(expiryTime, telegramId);
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
    const query = { otp: otp };
    const findOne = await OTP.findOne(query);
    const createdDate = findOne.createdAt;
    const value = { isverified: true, createdAt: createdDate };

    if (findOne && !findOne.isverified) {
      const data = await OTP.findOneAndUpdate(query, value);
      return { otp: findOne.otp, message: " OTP verified successfully" };
    } else {
      return { code: 409, status: "error", message: " OTP already verified" };
    }
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

setTTL = async (expiryTime, telegramId) => {
  try {
    const otp = generateOTP();
    const data = await saveData(telegramId, otp, expiryTime);
    return data;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

async function saveData(telegramId, otp, expiryTime) {
  const Schema = getSchema(expiryTime);
  let schemaTime = "";
  if (Schema) {
    schemaTime = Schema.obj.createdAt.default;
  }
  const OTP = mongoose.models.OTP || mongoose.model("OTP", Schema);

  var otpData = new OTP({
    telegramId: telegramId,
    otp: otp,
    isverified: false,
    createdAt: schemaTime,
  });

  const data = await otpData.save();
  return data;
}
