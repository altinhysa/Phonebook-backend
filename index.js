require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Number = require('./models/number')
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
  
    next(error)
  }
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(cors())
app.use(express.json())
app.use(requestLogger)
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

app.get('/api/persons/:id', (req,res, next) => {
    // const id = Number(req.params.id)
    // const person = persons.find(p => p.id === id)

    // if(person){
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }

    Number.findById(req.params.id).then(note => {
        if(note){
            res.json(note)
        } else {
            res.status(404).end()
        }
      }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req,res, next) => {
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

app.put('/api/persons/:id', (req,res,next) => {
    const { name, phone } = req.body
    
    Number.findByIdAndUpdate(req.params.id,{ name, phone},{ new: true, runValidators: true, context: 'query' }).then(updatedNumber => {
        res.json(updatedNumber)
    }).catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})