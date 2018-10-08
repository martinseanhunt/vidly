const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') }) 

const { User } = require('../../../models/user')
const auth = require('../../../middleware/auth')

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const token = new User({ name: 'flopper' }).generateAuthToken()

     // Create mock req, res, next
    const req = { 
      header: jest.fn().mockReturnValue(token),
    }
    const res = {}
    const next = jest.fn()

    auth(req, res, next)

    expect(req.user).toBeDefined()
    expect(req.user).toHaveProperty('name', 'flopper')
  })
})