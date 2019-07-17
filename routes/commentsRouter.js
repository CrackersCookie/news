const commentsRouter = require('express').Router()
const { editCommentByID } = require('../controllers/comments')

commentsRouter.route('/:comment_id').patch((editCommentByID))

module.exports = commentsRouter