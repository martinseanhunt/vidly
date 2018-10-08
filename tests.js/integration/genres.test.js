const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') }) 

const mongoose = require('mongoose')
const request = require('supertest')
const { Genre } = require('../../models/Genre')
const { User } = require('../../models/User')

let server

describe('/api/genres', () => {

  beforeEach(() => { server = require('../../index') })
  afterEach(async () => { 
    await Genre.remove({})
    await server.close()
  })
  
  describe('GET', () => {
    it('should return all genres', async () => {
      // pre populate database 
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
        { name: 'genre3' },
      ])

      const res = await request(server).get('/api/genres')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(3)
      // Checks that one of the returned objects has this value
      expect(res.body.some(genre => genre.name === 'genre2')).toBeTruthy()
      expect(res.body.some(genre => genre.name === 'genre9')).toBeFalsy()
    })
  })

  describe('GET/:id', () => {
    it('should return genre from given ID', async () => {
      // pre populate database 
      const genre = await new Genre({ name: 'genre44' }).save()
      const res = await request(server).get(`/api/genres/${genre._id}`)
      
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('genre44')
    })

    it('should return 404 with inbalid id', async () => {
      // pre populate database 
      const res = await request(server).get(`/api/genres/daefd243`)
      
      expect(res.status).toBe(404)
    })

    it('should return 404 if no genre is found with valid id', async () => {
      // pre populate database 
      const id = mongoose.Types.ObjectId()
      const res = await request(server).get(`/api/genres/${id}`)
      
      expect(res.status).toBe(404)
    })

  })

  describe('POST', () => {
    it('should return 401 if not authorized', async () => {
      const res = await request(server).post('/api/genres').send({ name: 'genre1' })
      expect(res.status).toBe(401)
    })

    it('should return 400 if genre is invalid', async () => {
      const token = new User().generateAuthToken()

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'd' })
      expect(res.status).toBe(400)
    })

    it('should return genre in body when name is provided', async () => {
      const token = new User().generateAuthToken()
      
      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' })

      expect(res.status).toBe(200)
      expect(res.body.name).toBe('genre1')
    })

    it('should corrrectly save the genre', async () => {
      const token = new User().generateAuthToken()
      
      await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' })

      const res = await Genre.find({ name: 'genre1' })

      expect(res[0].name).toBe('genre1')
    })
  })


  describe('PUT/:id', () => {
    it('should change a given property', async () => {
      const token = new User().generateAuthToken()
      
      const genre = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' })

      const id = genre.body._id

      const update = await request(server)
        .put(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send({ name: 'genre45556' })


      const updated = await Genre.findById(id)

      expect(updated.name).toBe('genre45556')
    })
  })


  describe('DELETE', () => {
    it('should delete a result', async () => {
      const token = new User({ isAdmin: true }).generateAuthToken()
      
      const genre = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' })

      const id = genre.body._id

      await request(server)
        .delete(`/api/genres/${id}`)
        .set('x-auth-token', token)

      const updated = await Genre.findById(id)

      expect(updated).toBeFalsy()
    })
  })

})