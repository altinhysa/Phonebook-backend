const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://altinhysa:${password}@phonebook.f3vnyys.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    phone: String,
})

const Number = mongoose.model('number', phoneBookSchema)

// if(process.argv.length===3){
//     console.log('phonebook: ')
//     Number.find({}).then(result=> {
//         result.forEach(number => {
//             console.log(`${number.name} ${number.phone}`)
//         })
//         mongoose.connection.close()
//     })
// }


// if(process.argv.length===5){
//     const phoneName = process.argv[3]
//     const nr = process.argv[4]
//     const number = new Number({
//         name: phoneName,
//         phone: nr,
//     })
//     number.save().then(result => {
//         console.log(`Added ${phoneName} number ${nr} to phonebook`)
//         mongoose.connection.close()
//     })
// }