require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Number = require('./models/number')
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));






const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}

// app.get('/api/persons', (req,res) => {
//     res.json(persons)
// })

let persons = []

app.get('/api/persons', (req,res) => {
    Number.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req,res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> 
    <p>${new Date()}<p>`)
    
})

app.get('/api/persons/:id', (req,res) => {
    // const id = Number(req.params.id)
    // const person = persons.find(p => p.id === id)

    // if(person){
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }

    Number.findById(request.params.id).then(note => {
        response.json(note)
      })
})

app.delete('/api/persons/:id', (req,res) => {
    // const id = Number(req.params.id)
    // persons = persons.filter(p => p.id !== id)
    Number.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// app.post('/api/persons', (req, res) => {
//     const body = req.body
//     const nameExists = persons.find(p => p.name === body.name)

//     if(!body.name){
//         return res.status(400).json({ 
//             error: 'name missing' 
//         })
//     }

//     if(!body.number){
//         return res.status(400).json({ 
//             error: 'number missing' 
//         })
//     }

//     if(nameExists){
//         return res.status(400).json({ 
//             error: 'name must be unique' 
//         })
//     }

//     const person = {
//         id: generateId(),
//         name: body.name,
//         number: body.number
//     }

//     persons = persons.concat(person)

//     res.json(person)
// })

app.post('/api/persons', (req,res) => {
    const body = req.body

    if(body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    if(body.phone === undefined) {
        return res.status(400).json({error: 'phone missing'})
    }

    const person = new Number({
        name: body.name,
        phone: body.phone
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})