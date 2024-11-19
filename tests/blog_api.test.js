const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

/* Excercise 4.8 */
test('blogs are returned as json and contains the right quantity of blogs', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
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
  const user = helper.user

  const result = await api
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const newBlog = {
    title: 'Adding blogs for testing',
    author: 'Superuser',
    url: '/adding-new-entries',
    likes: 9,
  }

 await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${result.body.token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  
  const response = await api.get('/api/blogs')

  const titles = response.body.map((r) => r.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

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

  const responseObject = JSON.parse(response.res.text)

  assert.strictEqual(responseObject.likes, 0)
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

/* Excercise 4.13 */
test('Delete erases entry', async () => {
  const blogsAtStart = await helper.notesInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, blogsAtStart.length - 1)
})

/* Excercise 4.14 */
test('Update likes of entry', async () => {
  const blogsAtStart = await helper.notesInDb()
  const blogToUpdate = blogsAtStart[0]
  const body = { likes: 50 }
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(body).expect(200)

  const response = await api.get(`/api/blogs/${blogToUpdate.id}`)
  assert.strictEqual(response._body.likes, body.likes)
})

after(async () => {
  await mongoose.connection.close()
})
