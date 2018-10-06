const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
    minlength: 3,
  }
})

const Genre = mongoose.model('Genre', genreSchema)

const validateGenre = (body, res) => {
  const schema = { name: Joi.string().min(3).required() }
  const { error } = Joi.validate(body, schema)

  return error ? error : null
}

exports.Genre = Genre
exports.validateGenre = validateGenre
exports.genreSchema = genreSchema