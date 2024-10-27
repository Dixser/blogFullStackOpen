const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, currentValue) => {
    return sum + currentValue.likes
  }, 0)
}
const favoriteBlog = (blogs) => {
  //return
  return blogs.reduce(
    (maxVal, currentValue) => {
      return currentValue.likes > maxVal.likes
        ? {
            title: currentValue.title,
            author: currentValue.author,
            likes: currentValue.likes,
          }
        : maxVal
    },
    { likes: 0 }
  )
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = lodash.map(
    lodash.countBy(blogs, 'author'),
    (value, key) => {
      return { author: key, blogs: value }
    }
  )
  return lodash.maxBy(blogsByAuthor, 'blogs')
}

const mostLikes = (blogs) => {
  /*   const blogsByAuthor = lodash.map(
    lodash.countBy(blogs, 'author'),
    (value, key) => {
      return { author: key, blogs: value }
    }
  ) */
  const likesByAuthor = lodash.map(lodash.groupBy(blogs, 'author'), (blog) => {
    return {
      author: blog[0].author,
      likes: lodash.reduce(
        blog,
        (sum, data) => {
          return sum + data.likes
        },
        0
      ),
    }
  })

  return lodash.maxBy(likesByAuthor, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
