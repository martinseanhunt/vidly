module.exports = routeHandler => 
  // We need to return a function that express can call - we don't explicityl call
  // route handlers because that's up to express!

  // With this approach, we still need to wrap our route handlers in a call to this function... e.g.
  /* 
    router.get('/', catchErrors(async (req, res, next) => {
      const genres = await Genre.find()
      res.send(genres)
    }))
  */
  // instead we can use something like express-async-errors which does this for us 
  // so this manual approach, and this file is not needed!


  async (req, res, next) => {
    try {
      await routeHandler(req, res)
    }
    catch(e) {
      next(e)
    }
  }
