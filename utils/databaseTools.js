const mongoose = require('mongoose')

const { Product } = require('../models/product')
const { Inventory } = require('../models/inventory')

const productService = require('../services/products')
const inventoryService = require('../services/inventory')

const parser = require('../utils/parser')
const merger = require('../utils/merger')

const getDatabase = async () => {
  const products = await Product.find({})
  const inventories = await Inventory.find({})

  const database = {
    storedProducts: products,
    storedInventories: inventories
  }

  const fullyInitialized = products.length > 0 && inventories.length > 0

  return fullyInitialized ? database : null
}

const initDatabase = async () => {
  console.log('Initializing database')
  dropDatabase()

  const productCategories = ['beanies', 'facemasks', 'gloves']
  const productData = await productService.getBatch(productCategories)

  const manufacturers = parser.parseManufacturers(productData)
  const inventoryData = await inventoryService.getBatch(manufacturers)

  const fullProductData = merger.mergeProductsAndInventory(productData, inventoryData)

  const Products = fullProductData.map(product => new Product(product))
  const Inventories = inventoryData.map(inventory => new Inventory(inventory))

  try {
    await Product.insertMany(Products)
    await Inventory.insertMany(Inventories)
    console.log('database initialization successful')
  } catch (error) {
    console.log('database initialization failed: ', error)
  }
}

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase()
    console.log('database dropped')
  } catch (error) {
    console.log('unable to drop database: ', error)
  }
}

const getUpdates = async () => {
  console.log('Getting database updates')
  const database = await getDatabase()

  if (!database) {
    return null
  }

  const storedProducts = database.storedProducts
  const storedInventories = database.storedInventories

  const productData = await productService.getUpdates(storedProducts)
  const currentManufacturers = parser.parseManufacturers(productData)

  const manufacturers = merger.mergeManufacturerData(currentManufacturers, storedInventories)
  const inventoryData = await inventoryService.getUpdates(manufacturers)

  await dropObsoleteManufacturers(currentManufacturers)

  if (!isModified(productData) && !isModified(inventoryData)) {
    console.log('no updates!')
    return null
  }

  const fullProductData = merger.mergeProductsAndInventory(productData, inventoryData)

  if (isModified(inventoryData)) {
    await saveInventoryUpdates(storedInventories, inventoryData)
    const updatedProducts = await saveProductUpdates(storedProducts, fullProductData)
    return updatedProducts
  } else if (isModified(fullProductData)) {
    const modifiedProducts = fullProductData.filter(({ modified }) => modified === true)
    const updatedProducts = await saveProductUpdates(storedProducts, modifiedProducts)
    return updatedProducts
  } else {
    return null
  }
}

const saveInventoryUpdates = async (storedInventories, inventoryData) => {
  const modifiedInventories = inventoryData.filter(({ modified }) => modified === true)

  const inventories = modifiedInventories.map(async inventory => {
    const storedInventory = storedInventories.find(({ manufacturer }) =>
      manufacturer === inventory.manufacturer)

    if (storedInventory) {
      return await updateStoredInventory(storedInventory, inventory)
    } else {
      return await saveNewInventory(inventory)
    }
  })

  const response = await Promise.all(inventories)

  return response
}

const saveProductUpdates = async (storedProducts, mergedProducts) => {
  const products = await mergedProducts.map(async product => {
    const stored = storedProducts.find(({ category }) =>
      category === product.category)

    if (stored) {
      return await updateStoredProducts(stored, product)
    } else {
      return await saveNewProducts(product)
    }
  })

  const response = Promise.all(products)
  return response
}

const updateStoredProducts = async (storedProducts, modifiedProducts) => {
  const newCatalog = modifiedProducts.catalog

  storedProducts.catalog = []
  storedProducts.catalog = newCatalog
  storedProducts.etag = modifiedProducts.etag

  return await storedProducts.save()
}

const updateStoredInventory = async (storedInventory, modifiedInventory) => {
  storedInventory.stock = []
  storedInventory.stock = modifiedInventory.stock
  storedInventory.etag = modifiedInventory.etag

  return await storedInventory.save()
}

const saveNewProducts = async (product) => {
  return await (new Product(product)).save()
}

const saveNewInventory = async (inventory) => {
  return await (new Inventory(inventory)).save()
}

const dropObsoleteManufacturers = async (manufacturers) => {
  try {
    await Inventory.deleteMany({ manufacturer: { $nin: manufacturers } })
  } catch (error) {
    console.log('Failed to remove obsolete manufacturers: ', error)
  }
}

const isModified = (data) => {
  const modificationData = data.map(item => item.modified)
  const modified = modificationData.includes(true)

  return modified
}

module.exports = {
  initDatabase,
  getDatabase,
  getUpdates,
}