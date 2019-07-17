const usersRouter = require("express").Router();
const { sendUserByID } = require("../controllers/users");
const { methodNotFound } = require("../errors/errors");

usersRouter
  .route("/:username")
  .get(sendUserByID)
  .all(methodNotFound);

module.exports = usersRouter;
