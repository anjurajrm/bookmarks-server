require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require('./config')
const validBearer = require("./validateBearer")
const errorHandler = require('./errorHandler')
const bookmarksRouter = require('./bookmarksRouter')

const app = express();

const morganOption = (NODE_ENV === 'production')

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(validBearer)
app.use(bookmarksRouter)
app.get('/', (req, res) => {
  res.send('Hello, world!')
})
app.use(errorHandler)

module.exports = app;
