const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const dotenv = require('dotenv')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
dotenv.config()

const url = process.env.MONGO_URL
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
        required: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
    },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Person', personSchema)
