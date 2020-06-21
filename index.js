const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
app.use(express.json())
morgan.token('object', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))
app.use(cors())
dotenv.config()
app.use(express.static('build'))


const pw = process.env.PW
console.log(pw)

let phonebook = [
    {
        "name": "Arto Hellas",
        "number": "39-44-5323522",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('http://localhost:3001/api/persons')
})

app.get('/info', (req, res) => {
    res.send(`The Phonebook has ${phonebook.length} entries.<br/>${new Date}`)
})

app.get('/api/persons', (req, res) => {
    res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = phonebook.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    const containsName = phonebook
        .find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "Empty field"
        })
    }

    if (containsName) {
        return res.status(400).json({
            error: `${body.name} is already in the phonebook`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000000)
    }
    phonebook = phonebook.concat(person)
    res.json(person)
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(note => note.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)