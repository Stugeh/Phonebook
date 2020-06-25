const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const dotenv = require('dotenv')
dotenv.config()

const url = process.env.MONGO_URL
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const personSchema = new mongoose.Schema({ "name": String, "number": String })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)