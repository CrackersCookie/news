const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js')
const { routeNotFound } = require('./errors/errors.js')

app.use('/api', apiRouter)


// Error handling...

app.all('/*', routeNotFound)

module.exports = app