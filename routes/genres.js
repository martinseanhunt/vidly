const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')

const { Genre, validateGenre } = require('../models/Genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateId = require('../middleware/validateId')

const router = express.Router()

// updating records is not very good here, check customers.js for reference

// Utils
const findGenre = async (id, res) => {
  const genre = await Genre.findById(id)    
  return !genre 
    ? res.status(404).send('Genre with ID not found')
    : genre
}

// Routes
router.get('/', async (req, res) => {
  const genres = await Genre.find()
  res.send(genres)
})

router.get('/:id', validateId , async (req, res) => {
  const genre = await findGenre(req.params.id, res)
  res.send(genre)
})

router.post('/', auth, async (req, res) => {
  const error = validateGenre(req.body, res)

  if(error) return res.status(400).send(error.message)

  const genre = new Genre({
    name: req.body.name
  })

  const result = await genre.save()
  res.send(result)
})

router.put('/:id', auth, async (req, res) => {
  const genre = await findGenre(req.params.id, res)
  const error = validateGenre(req.body, res)

  if(error) return res.status(400).send(error.message)

  genre.name = req.body.name

  await genre.save()  
  res.send(genre)
})

router.delete('/:id', auth, admin, async (req, res) => {
  const deleted = await Genre.findByIdAndRemove(req.params.id)
  res.send(deleted) 
})

module.exports = router