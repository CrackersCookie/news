const { selectTopics, insertTopic } = require("../models/topics");

const sendTopics = (req, res, next) => {
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const postTopic = (req, res, next) => {
  const { body } = req;
  insertTopic(body)
    .then(topic => {
      res.status(201).send({ topic });
    })
}

module.exports = { sendTopics, postTopic };
