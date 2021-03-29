const productsRouter = require('express').Router()
const { Product } = require('../models/product')

productsRouter.get('/', async (request, response) => {
  const beanies = await Product.find({ category: 'beanies' })
  const facemasks = await Product.find({ category: 'facemasks' })
  const gloves = await Product.find({ category: 'gloves' })

  const products = [
    { category: 'beanies', catalog: beanies.catalog },
    { category: 'facemasks', catalog: facemasks.catalog },
    { category: 'gloves', catalog: gloves.catalog }]

  if (products) {
    response.json(products)
  } else {
    response.status(404).end()
  }
})

productsRouter.get('/:category', async (request, response) => {
  const category = request.params.category

  const product = await Product.findOne({ category: category })
  const products = { category: product.category, catalog: product.catalog }

  if (products) {
    response.json(products)
  } else {
    response.status(404).end()
  }
})



module.exports = productsRouter