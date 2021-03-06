const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter.js");
const { routeNotFound, customErrors, sqlErrors, InternalErrors } = require("./errors/errors.js");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

// Error handling...

app.all("/*", routeNotFound);
app.use(customErrors);
app.use(sqlErrors);
app.use(InternalErrors);

module.exports = app;
