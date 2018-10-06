module.exports = () => {
  // This package wraps all async operations in try / catch blocks 
  // so we can handle all errors below after the routes
  require('express-async-errors') 

  // Handle / log unhandled promise rejections outside of routes
  // Winston will now catch this as an uncaught exception
  process.on('unhandledRejection', e => { throw e })
}