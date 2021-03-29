const mergeProductsAndInventory = (products, inventories) => {
  const merged = products
  merged.forEach(category => {
    category.catalog.forEach(product => {
      const inventory = inventories.find(({ manufacturer }) =>
        manufacturer === product.manufacturer)
      product['availability'] = inventory.stock[product.id]
    })
  })

  return merged
}

const mergeManufacturerData = (currentManufacturers, storedInventories) => {
  const manufacturers = currentManufacturers.map(manufacturer => {
    const storedInventory = storedInventories.find(inventory =>
      inventory.manufacturer === manufacturer)

    return storedInventory ? storedInventory : manufacturer
  })

  return manufacturers
}

module.exports = { mergeProductsAndInventory, mergeManufacturerData }