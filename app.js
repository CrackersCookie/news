const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js')
const { routeNotFound, customErrors } = require('./errors/errors.js')

app.use('/api', apiRouter)


// Error handling...

app.all('/*', routeNotFound)
app.use(customErrors)

module.exports = app