const express = require("express");
require("dotenv").config();
const route = require("./routes");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const { sendotp } = require("./service/OTPService");
require('./middleware/errorHandler');


app.use(express.json());

require("./config/mongoConnect").connect();

const bot = new TelegramBot(process.env.TELEBOT_TOKEN, { polling: true });

route.routes(app, bot);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
});

bot.onText(/start/, async function (msg) {
  var chatId = msg.chat.id;
  console.log("chatid ", chatId);
  const data = await sendotp(chatId, null);
  bot.sendMessage(chatId, "your otp is :" + data + " kindly  verify ");
});

app.listen(process.env.APP_PORT, async () => {
  console.log(`Debet gateway listening on port ${process.env.APP_PORT}!`);
});
