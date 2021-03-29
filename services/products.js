const axios = require('axios')
const baseUrl = 'https://bad-api-assignment.reaktor.com/v2/products'

const getProducts = async (category, etag) => {
  const response = await axios.get(`${baseUrl}/${category}`, {
    headers: { 'If-None-Match': etag ? etag : '' },
    validateStatus: (status) => { return status === 304 || status === 200 }
  })

  return {
    modified: response.status === 200,
    category: category,
    catalog: response.data,
    etag: response.headers['etag']
  }
}

const getUpdates = async (storedProducts) => {
  const productData = await getBatch(storedProducts)

  const products = productData.map(product => {
    const storedProduct = storedProducts.find(
      ({ category }) => category === product.category)

    return product.modified ? product : storedProduct
  })

  return products
}


const getBatch = async (batch) => {
  const response = await Promise.all(batch.map(item => {
    return item.etag ? getProducts(item.category, item.etag) : getProducts(item)
  }))

  return response
}


module.exports = {
  getProducts,
  getUpdates,
  getBatch
}