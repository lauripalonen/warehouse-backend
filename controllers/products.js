const productsRouter = require('express').Router()
const { Beanie, Facemask, Gloves } = require('../models/product')

productsRouter.get('/', async (request, response) => {
  const beanies = Beanie.find({})
  const facemasks = Facemask.find({})
  const gloves = Gloves.find({})

  const products = await Promise.all([beanies, facemasks, gloves])

  const catalog = [
    { category: 'beanies', products: products[0] },
    { category: 'facemasks', products: products[1] },
    { category: 'gloves', products: products[2] }]

  if (products) {
    response.json(catalog)
  } else {
    response.status(404).end()
  }
})

productsRouter.get('/:category', async (request, response) => {
  const category = request.params.category
  var Target = ''
  switch (category) {
    case ('beanies'): Target = Beanie; break
    case ('facemasks'): Target = Facemask; break
    case ('gloves'): Target = Gloves; break
    default: return
  }

  if (Target === '') {
    response.status(404).end()
  }

  const products = await Target.find({})
  if (products) {
    response.json(products)
  } else {
    response.status(404).end()
  }
})



module.exports = productsRouter