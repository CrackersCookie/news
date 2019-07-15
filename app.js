const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js')

app.use('/api', apiRouter)


module.exports = app