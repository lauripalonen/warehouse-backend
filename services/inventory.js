const axios = require('axios')
const parser = require('../utils/parser')

const baseUrl = 'https://bad-api-assignment.reaktor.com/v2/availability'

const validResponse = (response) => response.data.response != '[]'
const requestOptions = (etag) => ({
  headers: { 'If-None-Match': etag ? etag : '' },
  validateStatus: (status) => (status === 304 || status === 200)
})

const getInventory = async (manufacturer, etag) => {
  for (var attempts = 0; attempts < 10; attempts++) {
    const response = await axios.get(`${baseUrl}/${manufacturer}`, requestOptions(etag))

    if (validResponse(response)) {
      const modified = response.status === 200
      const stock = modified ? parser.parseStock(response.data.response) : []

      const inventoryData = {
        modified: modified,
        manufacturer: manufacturer,
        stock: stock,
        etag: response.headers['etag']
      }

      return inventoryData
    }

    console.log(`Attempt ${attempts + 1} failed for resource "${manufacturer}", retrying...`)
  }

  throw new Error(`Failed to fetch ${manufacturer} availability data after 10 attempts`)
}

const getUpdates = async (manufacturers) => {
  const inventoryData = await getBatch(manufacturers)

  const updates = inventoryData.map(inventory => {
    const storedInventory = manufacturers.find(
      ({ manufacturer }) => manufacturer === inventory.manufacturer)

    return inventory.modified ? inventory : storedInventory
  })

  return updates
}

const getBatch = async (batch) => {
  const response = await Promise.all(batch.map(item => {
    return item.etag ? getInventory(item.manufacturer, item.etag) : getInventory(item)
  }))

  return response
}

module.exports = {
  getInventory,
  getUpdates,
  getBatch
}