const parseManufacturers = (products) => {
  const manufacturers = new Set()
  products.forEach(category => {
    category.catalog.forEach(product => {
      manufacturers.add(product.manufacturer)
    })
  })

  return Array.from(manufacturers)
}

const parseStock = (response) => {
  const stocks = {}
  response.forEach(stock => {
    const id = stock.id.toLowerCase()
    const stockValue = stock.DATAPAYLOAD
      .match(/(?<=<INSTOCKVALUE>)([a-z0-9]+)(?=<\/INSTOCKVALUE>)/gmi)[0]

    stocks[id] = stockValue
  })

  return stocks
}

module.exports = {
  parseManufacturers,
  parseStock
}