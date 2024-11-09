const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/* const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
} */

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log('token:', decodedToken)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (body.title === undefined) {
    return response.status(400).json({
      error: 'Error: the title of the blog is missing',
    })
  }
  if (body.url === undefined) {
    return response.status(400).json({
      error: 'Error: url of the blog is missing',
    })
  }

  body.likes = body.likes === undefined ? 0 : body.likes

  body.user = user.id

  const blog = new Blog(body)
  const result = await blog.save()

  response.status(201).json(result)

  user.blogs = user.blogs.concat(result.id)
  await user.save()
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === decodedToken.id) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'token invalid' })
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes })

  response.json(updatedBlog)
})

module.exports = blogRouter
