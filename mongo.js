const dotenv = require('dotenv')
dotenv.config()

//you need to create a .env file with your own databases password.
const password = process.env.PW
const url = `mongodb+srv://Stugeh:<${password}>@cluster0-cj4cb.mongodb.net/<dbname>?retryWrites=true&w=majority`
