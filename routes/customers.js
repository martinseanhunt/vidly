const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')

const { Customer, validateCustomer } = require('../models/Customer')

const router = express.Router()

// Routes
router.get('/', async (req, res) => {
 const customer = await Customer
  .find()

  res.send(customer)
})

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(401).send('bad id')
  
  const customer = await Customer
   .findById(req.params.id)

  return customer 
    ? res.send(customer)
    : res.status(404).send('Item not found')
})

router.post('/', auth, async (req, res) => {
  validateCustomer(req.body, res)
  const { name, isGold, phone } = req.body
  
  const customer = new Customer({ name, isGold, phone })
  const result = await customer.save()
  res.send(result)
})

router.put('/:id', auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if(!customer) return res.status(404).send('Not found')

  const { name, phone, isGold } = customer

  const newCustomer = {
    name: req.body.name || name,
    phone: req.body.phone || phone,
    isGold: req.body.isGold || isGold,
  }

  validateCustomer(newCustomer, res)

  Object.assign(customer, newCustomer)

  const result = await customer.save()
  res.send(result)
})

router.delete('/:id', auth, async (req, res) => {
  const result = await Customer
    .findByIdAndRemove(req.params.id)

  res.send(result)
})

module.exports = router