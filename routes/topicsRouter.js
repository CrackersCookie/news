const topicsRouter = require('express').Router();


topicsRouter.route('/').get(sendTopics)

module.exports = apiRouter