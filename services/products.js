const axios = require('axios')
const baseUrl = 'https://bad-api-assignment.reaktor.com/v2/products'

const getProducts = async (category, etag) => {
  if (etag === undefined) {
    etag = ''
  }

  const response = await axios.get(`${baseUrl}/${category}`, {
    headers: { 'If-None-Match': etag },
    validateStatus: (status) => { return status === 304 || status === 200 }
  })

  return {
    category: category,
    data: response.data,
    etag: response.headers['etag']
  }
}

const getAll = async (categories) => {
  const products = await Promise.all(categories.map(category => {
    if (typeof category === Object) {
      return getProducts(category.type, category.etag)
    } else {
      return getProducts(category)
    }
  }))

  return products
}

module.exports = {
  getProducts,
  getAll
}