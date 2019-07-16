const articlesRouter = require('express').Router();
const { sendArticleByID } = require('../controllers/articles');
const { methodNotFound } = require('../errors/errors');

articlesRouter.route('/:article_id').get(sendArticleByID).all(methodNotFound)

module.exports = articlesRouter