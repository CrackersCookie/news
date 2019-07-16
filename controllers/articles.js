const { selectArticleByID } = require('../models/articles')

const sendArticleByID = (req, res, next) => {
  selectArticleByID(req.params).then((article) => {
    res.status(200).send({ article })
  })
}

module.exports = { sendArticleByID }