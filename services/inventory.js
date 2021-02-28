const axios = require('axios')
const baseUrl = 'https://bad-api-assignment.reaktor.com/v2/availability'

const validResponse = (response) => response.data.response != '[]'
const unModified = (response, etag) => etag === response.headers['etag']

const getInventory = async (manufacturer, etag) => {
  if (etag === undefined) {
    etag = ''
  }

  for (var attempts = 0; attempts < 10; attempts++) {
    const response = await axios.get(`${baseUrl}/${manufacturer}`, {
      headers: { 'If-None-Match': etag },
      validateStatus: (status) => { return status === 304 || status === 200 }
    })

    if (validResponse(response)) {
      const data = unModified(response, etag) ? '' : response.data.response
      return {
        manufacturer: manufacturer,
        data: data,
        etag: response.headers['etag']
      }
    }
  }

  throw new Error(`Failed to fetch ${manufacturer} availability data after 10 attempts`)
}

const getAll = async (manufacturers) => {
  const response = await Promise.all(
    manufacturers.map(manufacturer => getInventory(manufacturer)))
  return response
}

module.exports = {
  getInventory,
  getAll
}