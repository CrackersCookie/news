const { selectArticleByID, updateArticleVotesByID } = require('../models/articles')

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

module.exports = { sendArticleByID, editArticleByID }