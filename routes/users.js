const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')

const { User, validate } = require('../models/User')

const router = express.Router()

// Routes

router.get('/me', auth, async (req, res) => {
  const user = await User
    .findById(req.user._id).select('-password')

  res.send(user)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if(error) return res.status(400).send(error)

  const { email, password, name } = req.body
  
  const existingUser = await User.findOne({ email })
  if(existingUser) return res.status(400).send('user exists')

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)
  const user = new User({ email, password: hashed, name })

  const result = await user.save()

  const token = user.generateAuthToken()
  
  res.header('x-auth-token', token) // Do i need to use x here? 
  res.send(_.pick(user, ['name', 'email']))
})

module.exports = router