const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: 'Creating APIs with node is Easy if you know how!',
      author: 'Dani Ortiz',
      url: '/creating-api',
      likes: 5,
    },
    {
      title: 'Testing for Dummies!',
      author: 'Dani Ortiz',
      url: '/testing-backend',
      likes: 5,
    },
  ]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const notesInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, notesInDb
}