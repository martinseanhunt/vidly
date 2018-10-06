const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')

const { Movie, validate, validateEditing } = require('../models/Movie')
const { Genre } = require('../models/Genre')

const router = express.Router()

// Routes
router.get('/', async (req, res) => {
 const movies = await Movie
  .find()

  res.send(movies)
})

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(401).send('bad id')
  
  const movie = await Movie
   .findById(req.params.id)

  return movie 
    ? res.send(movie)
    : res.status(404).send('Item not found')
})

router.post('/', auth, async (req, res) => {
  validate(req.body, res)
  const { title, genreId, numberInStock, dailyRentalValue } = req.body

  if (!mongoose.Types.ObjectId.isValid(genreId))
    return res.status(401).send('bad id')

  const genre = await Genre
   .findById(genreId)

  if (!genre) return res.status(401).send('needs valid genre')

  const movie = new Movie({ 
    title, 
    genre: { _id: genre._id, name: genre.name }, 
    numberInStock, 
    dailyRentalValue 
  })

  const result = await movie.save().catch(e => handleError(e, res))
  res.send(result)
})


router.put('/:id', auth, async (req, res) => {
  const movie = await Movie.findById(req.params.id)

  if(!movie) return res.status(404).send('Not found')

  const { title, genreId, numberInStock, dailyRentalValue } = req.body

  let newGenre = null
  if(genreId && genreId !== movie.genre._id) {
    const genre = await Genre
      .findById(genreId)

    if (!genre) return res.status(404).send('invalid genre')

    newGenre = { _id: genre._id, name: genre.name }
  }

  const newMovie = {
    title: title || movie.title,
    genre: newGenre || movie.genre,
    numberInStock: numberInStock || movie.numberInStock,
    dailyRentalValue: dailyRentalValue || movie.dailyRentalValue
  }

  validateEditing(newMovie, res)

  Object.assign(movie, newMovie)

  const result = await movie.save().catch(e => handleError(e, res))
  res.send(result)
})

router.delete('/:id', auth, async (req, res) => {
  const result = await Movie
    .findByIdAndRemove(req.params.id)

  res.send(result)
})

module.exports = router