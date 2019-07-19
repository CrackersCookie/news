const articlesRouter = require("express").Router();
const {
  sendArticleByID,
  editArticleByID,
  postCommentByArticleID,
  sendCommentsByArticleID,
  sendArticles,
  postArticle,
  removeArticleByID
} = require("../controllers/articles");
const { methodNotFound } = require("../errors/errors");

articlesRouter
  .route("/")
  .get(sendArticles).post(postArticle)
  .all(methodNotFound);

articlesRouter
  .route("/:article_id")
  .get(sendArticleByID)
  .patch(editArticleByID)
  .delete(removeArticleByID)
  .all(methodNotFound);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleID)
  .get(sendCommentsByArticleID)
  .all(methodNotFound);

module.exports = articlesRouter;
