const mergeProductsAndStocks = (products, stocks) => {
  const merged = products
  merged.forEach(category => {
    category.data.forEach(product => {
      const id = product.id
      product['availability'] = stocks[id]
    })
  })

  return merged
}

module.exports = { mergeProductsAndStocks }