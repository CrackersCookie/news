const topicsRouter = require("express").Router();
const { sendTopics, postTopic } = require("../controllers/topics");
const { methodNotFound } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(postTopic)
  .all(methodNotFound);

module.exports = topicsRouter;
