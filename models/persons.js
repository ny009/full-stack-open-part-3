const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('Successfully Connected to Mongo!'))
  .catch(err => console.log('Error connecting to Mongo', err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)