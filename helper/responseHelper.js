exports.success = (res, code, message, results, api) => {
  const cde = results ? results.code : code;
  const stat = results ? code : "OK";
  const dat = results ? results.otp: "";
  const msg = results.message ? results.message : message;

  if (!res) return;

  res.status(200);

  if (!dat) {
    res.send({
      code: cde,
      status: stat,
      message: msg,
    });
  } else {
    res.send({
      code: cde,
      status: stat,
      data: dat,
      message: msg,
    });
  }
  if (message && message.code && message.code !== 200) {
    // throw Error(GCONSTANTS.API + api + GCONSTANTS.MSG + message.message);
  }
};

exports.error = (res, message, statusCode, httpStatus, api) => {
  res.status(statusCode);
  res.send({ status: "error", code: httpStatus, message: message });
  if (message) {
    //throw Error(GCONSTANTS.API + api + GCONSTANTS.MSG + message);
  }
};

exports.validation = (errors) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors,
  };
};
