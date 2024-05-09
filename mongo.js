const mongoose = require('mongoose')

const arg_len = process.argv.length

if (arg_len < 3) {
  console.log('Please enter the passsword needed to connect to mongo server and run the program like: "node mongo.js <password>"')
  process.exit(1)
}

if (arg_len > 3 && arg_len < 5) {
  console.log(`Please make sure to enter password, name, and number and run the 
  program like: "node mongo.js <password> <name> <number>`)
  process.exit(1)
}

const url = `mongodb+srv://nehal-full-stack-open:${process.argv[2]}@cluster0.gsu6gjm.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (arg_len > 3) {
  const {3: name, 4: number} = process.argv
  const person = new Person({
    name: name,
    number: number,
  })
  
  person.save().then(() => {
    console.log(`added ${name} number ${number} to the phonebook!`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(res => {
    console.log('phonebook:')
    res.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
}
