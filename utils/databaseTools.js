const { Beanie, Facemask, Gloves } = require('../models/product')
const Etag = require('../models/etag')

const productService = require('../services/products')
const inventoryService = require('../services/inventory')

const parser = require('../utils/parser')
const merger = require('../utils/merger')

const initDatabase = async () => {
  const categories = ['beanies', 'facemasks', 'gloves']
  const products = await productService.getAll(categories)
  const manufacturers = parser.parseManufacturers(products)
  const rawInventoryData = await inventoryService.getAll(manufacturers)
  const stockValues = parser.parseStockValues(rawInventoryData)

  const fullProductData = merger.mergeProductsAndStocks(products, stockValues)
  const eTags = parser.parseETags(products, rawInventoryData)

  const saved = await saveToDatabase(fullProductData, eTags)
  return saved
}

const saveToDatabase = async (products, etags) => {
  const beanies = products.find(product => product.category === 'beanies').data
  const facemasks = products.find(product => product.category === 'facemasks').data
  const gloves = products.find(product => product.category === 'gloves').data

  const result = await Promise.all([
    Beanie.insertMany(beanies),
    Facemask.insertMany(facemasks),
    Gloves.insertMany(gloves),
    Etag.insertMany(etags)
  ])

  return {
    beanies: result[0],
    facemasks: result[1],
    gloves: result[2],
    etags: result[4]
  }
}

const databaseIsEmpty = async () => {
  const result = await Etag.find({})
  return result.length === 0
}

const checkForUpdates = async () => {
  const etags = await Etag.find({})
  var result = await Promise.all(etags.map(async etag => {
    const target = etag.target
    const tag = etag.etag
    const name = etag.name

    if (target === 'product') {
      const products = await productService.getProducts(name, tag)
      if (products.data.length > 0) {
        return true
      }
    }

    if (target === 'manufacturer') {
      const rawInventoryData = await inventoryService.getInventory(name, tag)
      if (rawInventoryData.data.length > 0) {
        return true
      }
    }
  }))

  const updates = result.includes(true)

  return updates
}

const updateDataBase = async (connection) => {
  await connection.dropDatabase()
  const initialized = await initDatabase()
  return initialized
}



module.exports = {
  initDatabase,
  databaseIsEmpty,
  checkForUpdates,
  updateDataBase
}