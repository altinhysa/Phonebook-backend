const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url).then(result=> {
    console.log('connected to db')
}).catch((error) => {
    console.log('error connecting to db ', error.message)
})

const numberSchema = new mongoose.Schema({
    name: String,
    phone: String
})

numberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Number', numberSchema)
