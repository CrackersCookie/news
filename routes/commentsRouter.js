const commentsRouter = require('express').Router()
const { editCommentByID } = require('../controllers/comments')
const { methodNotFound } = require('../errors/errors')

commentsRouter.route('/:comment_id').patch((editCommentByID)).all(methodNotFound)

module.exports = commentsRouter