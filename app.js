const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const { mongoUrl } = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  }
  next(error)
}

app.use(errorHandler)

module.exports = app
