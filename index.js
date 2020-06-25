const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
morgan.token('object', req => JSON.stringify(req.body))
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(logger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))
const Person = require('./models/person')

// let phonebook = [
//     {
//         "name": "Arto Hellas",
//         "number": "39-44-5323522",
//         "id": 1
//     },
//     {
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523",
//         "id": 2
//     },
//     {
//         "name": "Dan Abramov",
//         "number": "12-43-234345",
//         "id": 3
//     },
//     {
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122",
//         "id": 4
//     }
// ]

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
    //const containsName = phonebook
    //    .find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "Empty field"
        })
    }

    //if (containsName) {
    //    return res.status(400).json({
    //        error: `${body.name} is already in the phonebook`
    //    })
    //}

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to the phonebook`)
        res.json(person)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    console.log('person :>> ', person);
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(newPerson => {
            res.json(newPerson)
        })
        .catch(err => next(err))
})

// delete person.
app.delete('/api/persons/:id', (req, res, next) => {
    console.log(req.params)
    Person.findByIdAndDelete(req.params.id)
        .then(person => {
            console.log('deleting person :>>', person)
            res.status(204).end()
        })
        .catch(err => next(err))
})



// run the server.
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)