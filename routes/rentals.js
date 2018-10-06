const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const Fawn = require('fawn')
const auth = require('../middleware/auth')

const { Rental, validate } = require('../models/Rental')
const { Movie } = require('../models/Movie')
const { Customer } = require('../models/Customer')

const router = express.Router()
Fawn.init(mongoose)

// Routes
router.get('/', async (req, res) => {
 const rentals = await Rental
  .find()
  .populate('customer movie')

  res.send(rentals)
})

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(401).send('bad id')
  
  const rental = await Rental
   .findById(req.params.id)

  return rental 
    ? res.send(rental)
    : res.status(404).send('Item not found')
})

router.post('/', auth, async (req, res) => {
  const error = validate(req.body)
  if(error) return res.status(400).send(error)

  const { movieId, customerId } = req.body

  if (!mongoose.Types.ObjectId.isValid(movieId))
    return res.status(401).send('bad Movie id')

  if (!mongoose.Types.ObjectId.isValid(customerId))
    return res.status(401).send('bad Customer id')

  const movie = await Movie
   .findById(movieId)

  // To do this properly I should use a 2 phase commit
  // fawn is a library that handles this under the hood

  if (!movie) return res.status(401).send('needs valid movie')
  if (movie.numberInStock < 1) return res.status(401).send('movie is out of stock')

  const customer = await Customer
   .findById(customerId)

  if (!customer) return res.status(401).send('needs valid customer')

  const rental = new Rental({ 
    movie: movie._id, 
    customer: customer._id
  })

  const result = await new Fawn.Task()
    .save('rentals', rental)
    .update('movies', { _id: movie._id }, {
      $inc: { numberInStock: -1 }
    })
    .run()
  
  res.send(rental)
})

router.put('/return/:id', auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id).populate('customer movie')

  if(!rental) return res.status(404).send('Not found')

  if(rental.dateReturned) return res.status(401).send('Already returned')

  const dateReturned = Date.now()
  const daysRented = moment(rental.dateRented).diff(moment(dateReturned), 'days')

  const returnInfo = { 
    dateReturned,
    rentalFee: daysRented * rental.movie.dailyRentalValue
  }

  Object.assign(rental, returnInfo)

  const result = await new Fawn.Task()
    .update('rentals', {_id: rental.id}, returnInfo)
    .update('movies', { _id: rental.movie._id }, {
      $inc: { numberInStock: 1 }
    })
    .run()
    .catch(e => handleError(e, res))

  res.send(result)
})

router.delete('/:id', auth, async (req, res) => {
  const result = await Rental
    .findByIdAndRemove(req.params.id)

  res.send(result)
})

module.exports = router