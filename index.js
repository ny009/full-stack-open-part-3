const express = require('express')
const morgan = require('morgan')

const app = express()

// Middleware defined
// Express JSON to parse request data
app.use(express.json())

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

app.get('/', (req, res) => res.send('<h1> Hello World! </h1>'))

app.get('/api/persons', (req, res) => res.json(persons))

app.get('/info', (req, res) => res.send(`
  <p> Phonebook has info for ${persons.length} people </p>
  <p> ${new Date()} </p>
  `)
)

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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

  // If the cases pass, we are gonna make a new entry
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }
  persons = [...persons, person]
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => console.log('Hello World, App is currently running on PORT', PORT))