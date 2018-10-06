const winston = require('winston')
require('winston-mongodb');
 
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.MongoDB({
      db: process.env.DATABASE_CONNECTION
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.MongoDB({
      db: process.env.DATABASE_CONNECTION
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
  logger.exceptions.handle(
    new winston.transports.Console({ format: winston.format.simple() })
  )
}

module.exports = logger