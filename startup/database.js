const mongoose = require('mongoose')
const logger = require('../utils/logger')

const db = process.env.DATABASE_CONNECTION

module.exports = () =>
  mongoose.connect(db)
    .then(() => logger.info(`connected to database: ${db}`))
