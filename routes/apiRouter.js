const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const { methodNotFound } = require('../errors/errors')
const json = require('../endpoints.json')

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.route('/')
  .get((req, res) => {
    res.status(200).send(json)
  })
  .all(methodNotFound);

module.exports = apiRouter;