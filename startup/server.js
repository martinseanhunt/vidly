const port = process.env.PORT || 3245
const logger = require('../utils/logger')

module.exports = (app) => {
  return app.listen(port, () => 
    logger.info(`Beep boop, I'm the Vidly server running on ${port}`))
}