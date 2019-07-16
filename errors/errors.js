exports.methodNotFound = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
}

exports.sqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    // console.log(err)
    res.status(400).send({ msg: err.message.split(' - ')[1] });
  }
  else next(err)
}

exports.InternalErrors = (err, req, res, next) => {
  // console.log(err)
  res.status(500).send({ msg: 'InternalErrors' });
}