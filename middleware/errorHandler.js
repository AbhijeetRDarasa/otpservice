// this is the place we take care of unhandled exception and rejections
//TBD wether we terminate the node process or not

process.on("uncaughtException", (err) => {
  console.log("We got and uncaught exception ", err);
});

process.on("unhandledRejection", (err) => {
  console.log("We got and unhandled rejection ", err);
});
