const { getSchema } = require("../model/OTP");

const mongoose = require("mongoose");

exports.sendotp = async (telegramId, expiryTime) => {
  try {
    //console.log("in the sendOTP");
    //var otp = generateOTP();
    const data = await setTTL(expiryTime, telegramId);
    //console.log("in the sendOTP");
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

    //console.log("find one ",findOne)
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
  //console.log("saveData", telegramId, otp);
  const Schema = getSchema(expiryTime);
  //console.log("after", telegramId, otp);
  let schemaTime = "";
  if (Schema) {
    //console.log("schema .....",Schema.obj.createdAt.default);
    schemaTime = Schema.obj.createdAt.default;
  }
  const OTP = mongoose.models.OTP || mongoose.model("OTP", Schema);

  var otpData = new OTP({
    telegramId: telegramId,
    otp: otp,
    isverified: false,
    createdAt: schemaTime,
  });

  //console.log("save", telegramId, otp);
  const data = await otpData.save();
  //console.log("after", data);
  console.log("data saved sucessfully", data);
  return data;
}
