const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

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

  body.user = request.user.id

  const blog = new Blog(body)
  const result = await blog.save()

  response.status(201).json(result)

  request.user.blogs = request.user.blogs.concat(result.id)
  await request.user.save()
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === request.user.id) {
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
