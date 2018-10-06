const mongoose = require('mongoose')
const Joi = require('joi')

const { genreSchema } = require('./Genre')

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  numberInStock: { type: Number, required: true },
  dailyRentalValue: { type: Number, required: true },
  genre: { type: genreSchema, required: true }
}))

const validate = (reqBody, res) => {
  const schema = {
    title: Joi.string().min(3).required(),
    numberInStock: Joi.number().required(),
    dailyRentalValue: Joi.number().required(),
    genreId: Joi.string().min(3).required()
  }

  const { error } = Joi.validate(reqBody, schema)
  return error ? res.status(400).send(error) : null
}

const validateEditing = (reqBody, res) => {
  const schema = {
    title: Joi.string().min(3).required(),
    numberInStock: Joi.number().required(),
    dailyRentalValue: Joi.number().required(),
    genre: Joi.object().required()
  }

  const { error } = Joi.validate(reqBody, schema)
  return error ? res.status(400).send(error) : null
}

exports.Movie = Movie
exports.validate = validate
exports.validateEditing = validateEditing