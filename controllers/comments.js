const { updatecommentByID, deletecommentByID } = require("../models/comments");

const editCommentByID = (req, res, next) => {
  const { params, body } = req;
  updatecommentByID(params, body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

const removecommentByID = (req, res, next) => {
  deletecommentByID(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

module.exports = { editCommentByID, removecommentByID };
