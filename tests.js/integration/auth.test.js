const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') }) 

const request = require('supertest')
const { User } = require('../../models/User')
const { Genre } = require('../../models/Genre')

let server

describe('auth middleware', () => {
  beforeEach(() => { server = 
    require('../../index') 
    token = new User().generateAuthToken() 
  })
  afterEach(async () => { 
    await Genre.remove({})
    await server.close() 
  })

  //This is a method for writing clean tests from Most - not required to do it this way
  let token

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' })
  }

  it('should return 401 if no token is provided', async () => {
    token = ''

    const res = await exec()
    expect(res.status).toBe(401)
  })

  it('should return 400 if token is invalid', async () => {
    token = 'dwa fsesegggggg'

    const res = await exec()
    expect(res.status).toBe(400)
  })
})