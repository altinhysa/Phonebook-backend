const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url).then(result=> {
    console.log('connected to db')
}).catch((error) => {
    console.log('error connecting to db ', error.message)
})


const phoneRegex = /^(0\d{1,2}-\d{6,8})$/;

const phoneValidator = [
  {
    validator: (value) => {
      return phoneRegex.test(value);
    },
    message: 'Invalid phone number format',
  },
  {
    validator: (value) => {
      const [firstPart, secondPart] = value.split('-');
      if (!firstPart || !secondPart) {
        return false;
      }
      if (firstPart.length === 2 || firstPart.length === 3) {
        return /^\d+$/.test(secondPart);
      }
      return false;
    },
    message: 'Phone number must be in the format XX-XXXXXXX or XXX-XXXXXXX',
  },
];


const numberSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: phoneValidator,
    }
})

numberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Number', numberSchema)
