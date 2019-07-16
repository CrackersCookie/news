exports.methodNotFound = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.customErrors = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg })
}