const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/persons')

const app = express()
// Middleware defined
// Express JSON to parse request data
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// Morgan to log info when API is called
morgan.token('print-post-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status - :response-time ms :print-post-body'))


// handler of requests with unknown endpoint

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.send(`
        <p> Phonebook has info for ${persons.length} people </p>
        <p> ${new Date()} </p>
      `)
    })
    .catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => res.json(person))
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  // Error Handling
  if (!name || !number) {
    return res.status(400).json({
      Error: 'Name or Number missing'
    })
  }

  // If the cases pass, we are gonna make a new entry
  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    .then(() => {
      console.log(`Added ${person.name} ${person.number}`)
      res.json(person)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  // Error Handling
  if (!name || !number) {
    return res.status(400).json({
      Error: 'Name or Number missing'
    })
  }

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

// Final middleware - unknown endpoint and error handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.messge)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed Id' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Hej! Server is currently running on PORT', PORT))