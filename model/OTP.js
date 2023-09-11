const mongoose = require("mongoose");

function getSchema(expiryTime) {
  console.log(expiryTime);
  let currentDate = new Date();
  console.log("currentDate", currentDate);
  if (expiryTime) {
    currentDate.setMinutes(currentDate.getMinutes() + expiryTime);
  } else {
    currentDate.setMinutes(currentDate.getMinutes() + 1); // else set default to one minute
  }
  console.log("currentDate", currentDate);
  const OTPSchema = new mongoose.Schema({
    telegramId: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: currentDate,
      expires: 0, // The document will be automatically deleted after 1 min / whenever the next cycle of the mongo schedular
      //is run from minutes of its creation time
    },
    createdAt: {
      type: Date,
      expires: 0,
      default: currentDate,
    },
    isverified: {
      type: Boolean,
    },
  });
  return OTPSchema;
}

function getModel(expiryTime) {
  const OTPSchema = getSchema(expiryTime);
  const OTP = mongoose.model("OTP", OTPSchema);
  return OTP;
}

function setexpiryTime(expiryTime) {
  expiryTimeLocal = expiryTime;
}

module.exports = { getSchema, setexpiryTime, getModel };
