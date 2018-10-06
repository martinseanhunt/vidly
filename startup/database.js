const mongoose = require('mongoose')
const logger = require('../utils/logger')

module.exports = () =>
  mongoose.connect(process.env.DATABASE_CONNECTION)
    .then(() => logger.info('connected to database'))


