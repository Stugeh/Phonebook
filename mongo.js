//const dotenv = require('dotenv')
//dotenv.config()
const mongoose = require('mongoose')
const password = process.argv[2]
const personSchema = new mongoose.Schema({ "name": String, "number": String })
const Person = mongoose.model('Person', personSchema)
const url = `mongodb+srv://Stugeh:${password}@cluster0-cj4cb.mongodb.net/Phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

//you need to create a .env file with your own databases password.
//if (!process.env.PW) {
//    console.log('please set up a .env file with a password')
//    process.exit(1)
//}
//const password = process.env.PW

if (process.argv[3] && process.argv[4]) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person(
        {
            name: name,
            number: number
        })
    console.log('person :>> ', person);
    person.save().then(res => {
        console.log(`added ${name} number ${number} to the phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('phonebook :>> ')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}







