const TelegramBot = require("node-telegram-bot-api");

const { sendotp } = require("../service/OTPService");

const bot = new TelegramBot(process.env.TELEBOT_TOKEN, { polling: true });

bot.onText(/start/, async function (msg) {
  var chatId = msg.chat.id;
  console.log("chatid ", chatId);
  const data = await sendotp(chatId, null);
  console.log("data" + data);
  bot.sendMessage(chatId, "your otp is :" + data.otp + " kindly  verify ");
});

module.exports = { bot };
