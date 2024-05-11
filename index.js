const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/persons')

const app = express()
// Middleware defined
// Express JSON to parse request data
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Morgan to log info when API is called
morgan.token('print-post-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status - :response-time ms :print-post-body'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

app.get('/api/persons', (req, res) => Person.find({}).then(persons =>res.json(persons)))

app.get('/info', (req, res) => res.send(`
  <p> Phonebook has info for ${persons.length} people </p>
  <p> ${new Date()} </p>
  `)
)

app.get('/api/persons/:id', (req, res) => {
Person.findById(req.params.id).then(person => res.json(person))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const isIdValid = persons.some(person => person.id === id)
  if (! isIdValid) {
    return res.status(404).json({
      Error: `ID: ${id} not found`
    })
  }
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  // Error Handling
  if (!body.name || !body.number) {
    return res.status(400).json({
      Error: 'Name or Number missing'
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      Error: 'Name must be unique'
    })
  }
  // // If the cases pass, we are gonna make a new entry
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(() => {
    console.log(`Added ${person.name} ${person.number}`)
    res.json(person)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Hej! Server is currently running on PORT', PORT))