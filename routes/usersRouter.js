const usersRouter = require("express").Router();
const { sendUserByID, postUser, sendUsers } = require("../controllers/users");
const { methodNotFound } = require("../errors/errors");

usersRouter
  .route("/:username")
  .get(sendUserByID)
  .all(methodNotFound);

usersRouter
  .route("/")
  .get(sendUsers)
  .post(postUser)
  .all(methodNotFound);

module.exports = usersRouter;
