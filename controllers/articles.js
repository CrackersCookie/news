const {
  selectArticleByID,
  updateArticleVotesByID,
  insertCommentByArticleID,
  selectCommentsByArticleID
} = require("../models/articles");

const sendArticleByID = (req, res, next) => {
  selectArticleByID(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const editArticleByID = (req, res, next) => {
  const { params, body } = req;
  updateArticleVotesByID(params, body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
const postCommentByArticleID = (req, res, next) => {
  const { params, body } = req;
  insertCommentByArticleID(params, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const sendCommentsByArticleID = (req, res, next) => {
  selectCommentsByArticleID(req.params).then(comments => {
    res.status(200).send({ comments });
  });
};

module.exports = {
  sendArticleByID,
  editArticleByID,
  postCommentByArticleID,
  sendCommentsByArticleID
};
