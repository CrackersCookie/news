const articlesRouter = require("express").Router();
const {
  sendArticleByID,
  editArticleByID,
  postCommentByArticleID,
  sendCommentsByArticleID
} = require("../controllers/articles");
const { methodNotFound } = require("../errors/errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleByID)
  .patch(editArticleByID)
  .all(methodNotFound);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleID)
  .get(sendCommentsByArticleID)
  .all(methodNotFound);

module.exports = articlesRouter;
