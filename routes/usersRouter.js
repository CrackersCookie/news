const usersRouter = require('express').Router();
const { sendUserByID } = require('../controllers/users')

usersRouter.route('/:username').get(sendUserByID)

module.exports = usersRouter