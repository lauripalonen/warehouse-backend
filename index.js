const express = require('express')
const axios = require('axios')

const app = express()

const baseUrl = 'https://bad-api-assignment.reaktor.com/v2'

const getProducts = async (categories) => {
  const url = `${baseUrl}/products`

  const productsByCategories = await Promise.all(
    categories.map(async category => {
      try {
        const response = await axios.get(`${url}/${category}`)
        return response.data

      } catch (error) {
        throw new Error(`Couldn't retrieve product data for ${category}: ${error}`)
      }
    })
  )

  const productsAll = [].concat.apply([], productsByCategories)

  return productsAll
}

const productCatalog = async (categories) => {
  const products = await getProducts(categories)

  const productsById = {}
  const manufacturers = new Set()

  products.forEach(product => {
    productsById[product.id] = product
    manufacturers.add(product['manufacturer'])
  })

  return { products: productsById, manufacturers: [...manufacturers] }
}

const validResponse = (response) => {
  if (response.data.response.length === 2 &&
    typeof response.data.response === 'string') {
    return false
  }
  return true
}


const getAvailability = async (manufacturer) => {
  const url = `${baseUrl}/availability`
  var attempts = 0

  while (true) {
    if (attempts > 10) {
      throw new Error(`Availability data retrieval failed after 10 attempts`)
    }

    console.log(`Attempting fetch ${url}/${manufacturer} | Current attempt: ${attempts}`)

    try {
      const response = await axios.get(`${url}/${manufacturer}`)
      if (validResponse(response)) {
        return response.data.response
      }
    } catch (error) {
      throw new Error(`Encountered an error while attempting to retrieve availability data for ${manufacturer}\n Attempt number: ${attempts}`)
    }
    attempts++
  }
}

const getStockData = async (manufacturers) => {
  const stocksByManufacturers = await Promise.all(
    manufacturers.map(async manufacturer => {
      try {
        const response = await getAvailability(manufacturer)
        return response

      } catch (error) {
        console.log(error)
      }
    })
  )

  const stocksAll = [].concat.apply([], stocksByManufacturers)
  const stockValuesById = {}

  stocksAll.forEach(product => {
    const id = product.id.toLowerCase()
    const inStockValue = product.DATAPAYLOAD
      .match(/(?<=<INSTOCKVALUE>)([a-z0-9]+)(?=<\/INSTOCKVALUE>)/gmi)[0]

    stockValuesById[id] = inStockValue
  })

  return stockValuesById
}

const initializeData = async () => {
  const categories = ['gloves', 'facemasks', 'beanies']

  const catalog = await productCatalog(categories)
  const products = catalog.products
  const manufacturers = catalog.manufacturers

  const stockData = await getStockData(manufacturers)

  const inventory = mergeProductsAndStockData(products, stockData)

  console.log(inventory)

  return inventory

}

const mergeProductsAndStockData = (products, stocks) => {
  const merged = {}

  for (const productId in products) {
    merged[productId] = {
      ...products[productId],
      availability: stocks[productId]
    }
  }

  return merged

}

initializeData()

app.get('/', (request, response) => {
  response.send(`<h1>Hello world</h1>`)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)