const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())

let blogs = [
  {
    id: 1,
    title: "How I spent my summer",
    author: "Victoria Backham",
    url: "https://dummyurl.com",
    likes:4,
  },
  {
    id: 2,
    title: "How I spent my winter",
    author: "David Backham",
    url: "https://url.com",
    likes:5,
  },
  {
    id: 3,
    title: "How I spent my autumn",
    author: "David Johnson",
    url: "https://urlyellow.com",
    likes:1,
  }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/blogs', (request, response) => {
  response.json(blogs)
})

app.get('/api/blogs/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const blog = blogs.find(blog => blog.id === id)
    if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
  })


const generateId = () => {
    const maxId = blogs.length > 0
      ? Math.max(...blogs.map(b => b.id))
      : 0
    return maxId + 1
  }
  
app.post('/api/blogs', (request, response) => {
    const body = request.body
    console.log(body)
  
    if (!body.title) {
      return response.status(400).json({ 
        error: 'title missing' 
      })
    }

    if (!body.author) {
        return response.status(400).json({ 
          error: 'author missing' 
        })
    }

    if (!body.url) {
        return response.status(400).json({ 
          error: 'url missing' 
        })
    }

    if (!body.likes) {
        return response.status(400).json({ 
          error: 'likes missing' 
        })
    }
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      id: generateId(),
    }
  
    blogs = blogs.concat(blog)
  
    response.json(blog)
  })

app.delete('/api/blogs/:id', (request, response) => {
    const id = Number(request.params.id)
    blogs = blogs.filter(blog => blog.id !== id)
    response.status(204).end()
  })

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
