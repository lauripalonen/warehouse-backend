const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  color: [String],
  price: Number,
  manufacturer: String,
  availability: String
}, {_id: false})

const productSchema = new mongoose.Schema({
  etag: String,
  category: String,
  catalog: [itemSchema]
})

const Product = mongoose.model('Products', productSchema)

module.exports = { Product }