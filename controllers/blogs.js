const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogRouter.post('/', async (request, response) => {
  if (request.body.title === undefined) {
    return response.status(400).json({
      error: 'Error: the title of the blog is missing',
    })
  }
  if (request.body.url === undefined) {
    return response.status(400).json({
      error: 'Error: url of the blog is missing',
    })
  }

  request.body.likes = request.body.likes === undefined ? 0 : request.body.likes

  const blog = new Blog(request.body)
  const result = await blog.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes })

  response.json(updatedBlog)
})

module.exports = blogRouter
