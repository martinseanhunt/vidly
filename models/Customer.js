const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model('Customer', new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true, minlength: 3 },
  phone: { type: String, required: true, minlength: 4, maxlength: 18 }
}))

const validateCustomer = (reqBody, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(4).required(),
    isGold: Joi.boolean()
  }

  const { error } = Joi.validate(reqBody, schema)
  return error ? res.send(error) : null
}

exports.Customer = Customer
exports.validateCustomer = Customer