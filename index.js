const express = require('express')
const dotenv = require('dotenv')

// Config
dotenv.config()

// Logging 
require('./startup/logging')()

// Init 
const app = express()

// Routes
require('./startup/routes')(app)

// Database
require('./startup/database')()

// Server
const server = require('./startup/server')(app)

module.exports = server