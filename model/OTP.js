const document_expiry = process.env.DOCUMENT_EXPIRY;

const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    expires: "0", // The document will be automatically deleted after 1 min / whenever the next cycle of the mongo schedular
    //is run from minutes of its creation time
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 0,
  },
});

const OTP = mongoose.model("OTP", OTPSchema);

OTPSchema.pre("save", async function (next) {
  const document = this;
  console.log("New document saved to database");
  if (document_expiry) {
    console.log(document_expiry);
    document.otp.expires = 0;
    document.createdAt.expires = document_expiry;
  }
  setCustomExpiry();
  next();
});

async function setCustomExpiry() {
  if (document_expiry)
    OTPSchema.path("otp").index({ expires: document_expiry });
  else OTPSchema.path("otp").index({ expires: "1m" });
}
module.exports = OTP;
