const parseManufacturers = (products) => {
  const manufacturers = new Set()
  products.forEach(category => {
    category.data.forEach(product => {
      manufacturers.add(product.manufacturer)
    })
  })

  return Array.from(manufacturers)
}

const parseStockValues = (inventoryData) => {
  const availabilities = {}
  inventoryData.forEach(manufacturer => {
    manufacturer.data.forEach(product => {
      const id = product.id.toLowerCase()
      const inStockValue = product.DATAPAYLOAD
        .match(/(?<=<INSTOCKVALUE>)([a-z0-9]+)(?=<\/INSTOCKVALUE>)/gmi)[0]

      availabilities[id] = inStockValue
    })
  })

  return availabilities
}

const parseETags = (products, manufacturers) => {
  const etags = []
  products.forEach(product => etags.push({ target: 'product', name: product.category, etag: product.etag }))
  manufacturers.forEach(manufacturer => etags.push({ target: 'manufacturer', name: manufacturer.manufacturer, etag: manufacturer.etag }))
  return etags
}

module.exports = {
  parseManufacturers,
  parseStockValues,
  parseETags
}