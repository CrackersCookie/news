exports.methodNotFound = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.sqlErrors = (err, req, res, next) => {
  const sqlErrorCodes = ["22P02", "42703", "23502"];
  if (sqlErrorCodes.includes(err.code)) {
    res.status(400).send({ msg: err.message.split(" - ")[1] });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else next(err)
};

exports.InternalErrors = (err, req, res, next) => {
  // console.log(err);
  res.status(500).send({ msg: "Internal Error" });
};
