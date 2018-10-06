const express = require('express')
const genres = require('../routes/genres')
const customers = require('../routes/customers')
const movies = require('../routes/movies')
const rentals = require('../routes/rentals')
const users = require('../routes/users')
const auth = require('../routes/auth')
const handleError = require('../middleware/handleError')

module.exports = (app) => {
  app.use(express.json())

  // Routes
  app.get('/', (req, res) => res.send('Welcome to vidly'))
  app.use('/api/genres', genres)
  app.use('/api/customers', customers)
  app.use('/api/movies', movies)
  app.use('/api/rentals', rentals)
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  
  // Route Error Handling
  app.use(handleError)
}