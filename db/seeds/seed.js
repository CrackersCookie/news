const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function (connection) {

  const topicsInsertions = connection('topics').insert(topicData);
  const usersInsertions = connection('users').insert(userData);

  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest()).then(() => {
      return Promise.all([topicsInsertions, usersInsertions])
    })
    .then(() => {
      const formattedArticles = formatDates(articleData)
      return connection('articles').insert(formattedArticles).returning('*')
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return connection('comments').insert(formattedComments)
    });
};
