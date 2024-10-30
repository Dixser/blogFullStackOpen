const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const { mongoUrl } = require('./utils/config')
const blogRouter = require('./controllers/blogs')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)


module.exports = app