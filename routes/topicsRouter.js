const topicsRouter = require('express').Router();
const { sendTopics } = require('../controllers/topics')
const { methodNotFound } = require('../errors/errors')

topicsRouter.route('/').get(sendTopics).all(methodNotFound)

module.exports = topicsRouter