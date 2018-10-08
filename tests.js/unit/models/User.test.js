const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') }) // path to test env variables
const jwt = require('jsonwebtoken')

const { User } = require('../../../models/User')

describe('generateAuthToken', () => {
  it('should return a JWT token after a user is crested', () => {
    const user = new User({
      name: 'Martin',
      email: 'martin@c.com',
      password: 'flippypass'
    })

    const token = user.generateAuthToken()
    expect(token).toBeTruthy()

    const decoded = jwt.decode(token)
    expect(decoded).toHaveProperty('name')
    expect(decoded).toHaveProperty('isAdmin')
    expect(decoded).toHaveProperty('_id')
    expect(decoded.name).toMatch(/martin/i)
  })
})