const connection = require("../db/connection");

const selectTopics = () => {
  return connection.select("*").from("topics");
};

const insertTopic = (postBody) => {
  return connection
    .insert(postBody)
    .into("topics")
    .returning("*")
    .then(article => article[0]);
}

module.exports = { selectTopics, insertTopic };
