const jwt = require('jsonwebtoken')

module.exports =  function(req, res, next) {
  const token = req.header('x-auth-token')
  if(!token) return res.status(401).send('Denaied: Needs Auth Token')

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = decoded
    next()
  }
  catch(e) {
    console.log(e)
    res.status(400).send(e.message)
  }
}

