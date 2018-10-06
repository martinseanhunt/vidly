const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const schema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  isAdmin: { type: Boolean, default: false }
})

schema.methods.generateAuthToken = function() {
  return jwt.sign({ name: this.name, _id: this.id, isAdmin: this.isAdmin }, process.env.JWT_KEY)
}

const User = mongoose.model('User', schema)

const validate = reqBody => Joi.validate(reqBody, {
  name: Joi.string().min(3).required(),
  email: Joi.string().min(3).required().email(),
  password: Joi.string().min(5).required()
})

exports.User = User
exports.validate = validate