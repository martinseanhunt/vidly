const mongoose = require('mongoose')
const Joi = require('joi')

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  dateRented: {
    type: Date,
    required: true, 
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number, 
    min: 0
  }
}))

const validate = reqBody => {
  const schema = {
    customerId: Joi.string().min(3).required(),
    movieId: Joi.string().required()
  }

  const { error } = Joi.validate(reqBody, schema)
  return error ? error : null
}

exports.Rental = Rental
exports.validate = validate
