const commentsRouter = require("express").Router();
const {
  editCommentByID,
  removecommentByID
} = require("../controllers/comments");
const { methodNotFound } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .patch(editCommentByID)
  .delete(removecommentByID)
  .all(methodNotFound);

module.exports = commentsRouter;
