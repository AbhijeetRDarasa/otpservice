const { generateOTP } = require("../helper/otpGenerator");
const { getSchema, getModel } = require("../model/OTP");

//const mongoose = require("mongoose");

exports.sendotp = async (telegramId, emailId, expiryTime) => {
  try {
    const data = await setTTL(telegramId, emailId, expiryTime);
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.verify = async (otp, emailId, telegramId) => {
  try {
    console.log("in the verify");
    const Schema = getSchema(null);
    const OTP = getModel(Schema);
    let query = null;
    if (emailId) {
      query = { emailId: emailId, otp: otp };
    } else if (telegramId) {
      query = { telegramId: telegramId, otp: otp };
    } else {
      query = { otp: otp };
    }
    const findOne = await OTP.findOne(query);
    if (!findOne) {
      return { code: 404, success: false, message: " No Data found " };
    }
    const createdDate = findOne.createdAt;
    const value = { isverified: true, createdAt: createdDate };
    if (findOne && !findOne.isverified) {
      const data = await OTP.findOneAndUpdate(query, value);
      return { otp: findOne.otp, message: " OTP verified successfully" };
    } else {
      return { code: 400, success: false, message: " OTP already verified" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

setTTL = async (telegramId, emailId, expiryTime) => {
  try {
    const otp = generateOTP();
    console.log("OTP generated ");
    const data = await saveData(telegramId, emailId, otp, expiryTime);
    return data;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

async function saveData(telegramId, emailId, otp, expiryTime) {
  const Schema = getSchema(expiryTime);
  let schemaTime = "";
  if (Schema) {
    schemaTime = Schema.obj.createdAt.default;
  }
  const OTP = getModel(Schema);

  var otpData = new OTP({
    telegramId: telegramId,
    otp: otp,
    isverified: false,
    createdAt: schemaTime,
    emailId: emailId,
  });

  const data = await otpData.save();
  return data;
}
