const { updatecommentByID } = require('../models/comments')

const editCommentByID = (req, res, next) => {
  const { params, body } = req;
  updatecommentByID(params, body)
    .then(comment => {
      res.status(200).send({ comment });
    }).catch(next)
}

module.exports = { editCommentByID }