const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
morgan.token('object', req => JSON.stringify(req.body))
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))
const Person = require('./models/person')

// Root of the app. Prints the path of the phonebook itself.
app.get('/', (req, res) => {
    res.send('/api/persons')
})

// Prints some info about the phonebook.
app.get('/info', (req, res) => {
    Person.find({}).then(phonebook =>
        res.send(`The Phonebook has ${phonebook.length} entries.<br/>${new Date}`)
    )
})

// Phonebook itself.
app.get('/api/persons', (req, res) => {
    Person.find({}).then(phonebook => {
        res.json(phonebook)
    })

})

// individual person.
app.get('/api/persons/:id', (req, res, next) => {
    console.log("finding individual..")
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                console.log('getting person :>> ', person);
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})

// add person.
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "Empty field"
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to the phonebook`)
        res.json(person)
    })
})

// Updates the number of an existing person
app.put('/api/persons/:id', (req, res, next) => {
    console.log('req.body :>> ', req.body);
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(newPerson => {
            console.log('updating person :>> ', newPerson)
            res.json(newPerson)
        })
        .catch(err => next(err))
})

// delete person.
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(person => {
            console.log('deleting person :>>', person)
            res.status(204).end()
        })
        .catch(err => next(err))
})

// Handles unknown adresses
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// handles errors
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: "malformatted id" })
    }
    next(error)
}

app.use(errorHandler)

// run the server.
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)



