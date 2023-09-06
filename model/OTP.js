const mongoose = require("mongoose");
const moment = require("moment");

let expiryTimeLocal = "";

function getSchema(expiryTime) {
  console.log(expiryTime);
  let currentDate = new Date();
  if (expiryTime) {
    currentDate.setMinutes(currentDate.getMinutes() + expiryTime);
  } else {
    currentDate.setMinutes(currentDate.getMinutes() + 1); // else set default to one minute
  }
  const OTPSchema = new mongoose.Schema({
    telegramId: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: currentDate,
      expires: expiryTime, // The document will be automatically deleted after 1 min / whenever the next cycle of the mongo schedular
      //is run from minutes of its creation time
    },
    createdAt: {
      type: Date,
      expires: expiryTime,
      default: currentDate,
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
