const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const inventorySchema = new mongoose.Schema({
  etag: String,
  stock: mongoose.Mixed,
  manufacturer: String
})

const Inventory = mongoose.model('Inventories', inventorySchema)

module.exports = { Inventory }