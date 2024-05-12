const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('Successfully Connected to Mongo!'))
  .catch(err => console.log('Error connecting to Mongo', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: v => {
        return /\d{2,3}-\d+/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)