const logger = require('../utils/logger')

module.exports = (e, req, res, next) => {
  // Winston has these logging types
  // error, warn, info, verbose, debug, silly
  logger.error(e.message, e)
  res.status(500).send('Something went wrong!')
}