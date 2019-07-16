const articlesRouter = require('express').Router();
const { sendArticleByID } = require('../controllers/articles')

articlesRouter.route('/:article_id').get(sendArticleByID)

module.exports = articlesRouter