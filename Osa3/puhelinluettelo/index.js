const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = persons.findIndex(p => p.id === id)

  if (index !== -1) {
    persons.splice(index, 1)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const nameExists = persons.some(p => p.name.toLowerCase() === name.toLowerCase())
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  let id
  do {
    id = Math.floor(Math.random() * 1000000) + 1
  } while (persons.find(p => p.id === id))

  const newPerson = { id, name, number }
  persons.push(newPerson)

  res.status(201).json(newPerson)
})


app.get('/info', (req, res) => {
  const now = new Date()
  const personCount = persons.length

  res.send(`
    <div>
      <p>Phonebook has info for ${personCount} people</p>
      <p>${now}</p>
    </div>
  `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
