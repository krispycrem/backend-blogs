const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id).
  then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }

  if (body.author === undefined) {
    return response.status(400).json({ error: 'author missing' })
  }

  if (body.url === undefined) {
    return response.status(400).json({ error: 'url missing' })
  }

  if (body.likes === undefined) {
    return response.status(400).json({ error: 'likes missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog.save().then(savedBlog => {
    response.json(savedBlog)
  })
  .catch(error => next(error))

})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    Blog.findByIdAndUpdate(request.params.id, blog,     
      { new: true, runValidators: true, context: 'query' }
    )
      .then(updatedBlog => {
        response.json(updatedBlog)
      })
      .catch(error => next(error))
  })

module.exports = blogsRouter


