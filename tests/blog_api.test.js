const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { title } = require('node:process')

const api = supertest(app)

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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

/* Excercise 4.8 */
test('blogs are returned as json and contains the right quantity of blogs', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

/* Excercise 4.9 */
test('blogs contain id propierty and not _id', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  response.body.map((r) => {
    assert.notStrictEqual(r.id, undefined)
    assert.strictEqual(r._id, undefined)
  })
})

/* Excercise 4.10 */
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Adding blogs for testing',
    author: 'Dani Ortiz',
    url: '/adding-new-entries',
    likes: 9,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map((r) => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  assert(titles.includes('Adding blogs for testing'))
})

/* Excercise 4.11 */
test('Likes default to 0', async () => {
  const newBlog = {
    title: 'A blog without likes sets to 0',
    author: 'Dani Ortiz',
    url: '/default-values',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    console.log('response:',response.res.text)
    
    //assert.strictEqual(response.body.likes, 0)
})

/* Excercise 4.12 */
describe('adding a new blog without requiered fields', () => {
  test('missing name returns 400', async () => {
    const newBlog = {
      author: 'Dani Ortiz',
      url: '/default-values',
      likes: 4,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
  test('missing url returns 400', async () => {
    const newBlog = {
      title: 'A blog without likes sets to 0',
      author: 'Dani Ortiz',
      likes: 4,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
})
