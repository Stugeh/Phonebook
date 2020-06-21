const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')



const test = () => {
    //you need to create a .env file with your own databases password.
    if (!process.env.PW) {
        console.log('please set up a .env file with a password')
        process.exit(1)
    }
    const password = process.env.PW
    const url = `mongodb+srv://Stugeh:${password}@cluster0-cj4cb.mongodb.net/Phonebook?retryWrites=true&w=majority`
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

    const personSchema = new mongoose.Schema(
        {
            "name": String,
            "number": String
        }
    )

    const Person = mongoose.model('Person', personSchema)

    const person = new Person(
        {
            name: 'Juho',
            number: '123'
        }
    )
    person.save().then(res => {
        console.log("saved")
        mongoose.connection.close()
    })
}

module.exports = () => {
    test()
}
