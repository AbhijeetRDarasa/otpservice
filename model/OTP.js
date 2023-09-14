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
    emailId: {
      type: String,
    },
  });
  return OTPSchema;
}

function getModel(Schema) {
  const OTP = mongoose.models.OTP || mongoose.model("OTP", Schema);
  return OTP;
}

function setexpiryTime(expiryTime) {
  expiryTimeLocal = expiryTime;
}

module.exports = { getSchema, setexpiryTime, getModel };
