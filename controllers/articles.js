const { selectArticleByID, updateArticleVotesByID, insertCommentByArticleID } = require('../models/articles')

const sendArticleByID = (req, res, next) => {
  selectArticleByID(req.params).then((article) => {
    res.status(200).send({ article })
  }).catch(next)
}

const editArticleByID = (req, res, next) => {
  const { params, body } = req
  updateArticleVotesByID(params, body).then((article) => {
    res.status(200).send({ article })
  }).catch(next)
}
const postCommentByArticleID = (req, res, next) => {
  const { params, body } = req
  insertCommentByArticleID(params, body).then((comment) => {
    res.status(201).send({ comment })
  })
}

module.exports = { sendArticleByID, editArticleByID, postCommentByArticleID }