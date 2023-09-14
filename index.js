const express = require("express");
require("dotenv").config();
const route = require("./routes");
const app = express();
require("./middleware/errorHandler");

app.use(express.json());

require("./config/mongoConnect").connect();

const { bot } = require("./middleware/botMiddleWare");

route.routes(app, bot);

app.listen(process.env.APP_PORT, async () => {
  console.log(`Debet gateway listening on port ${process.env.APP_PORT}!`);
});
