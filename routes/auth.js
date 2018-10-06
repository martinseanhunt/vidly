const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const { User } = require('../models/User')

const router = express.Router()

// Utils

const validate = reqBody => Joi.validate(reqBody, {
  email: Joi.string().min(3).required().email(),
  password: Joi.string().min(5).required()
})

// Routes
router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if(error) return res.status(400).send(error)

  const { email, password } = req.body
  
  const user = await User.findOne({ email })
  if(!user) return res.status(400).send('Invalid email or password')

  const validPassword = await bcrypt.compare(password, user.password)
  if(!validPassword) return res.status(400).send('Invalid email or password')

  const token = user.generateAuthToken()

  res.send(token)
})

// Logout happens on front end - just delete token from localstorage

module.exports = router