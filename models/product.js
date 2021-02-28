const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const productSchema = new mongoose.Schema({
  _id: String,
  type: String,
  name: String,
  color: [String],
  price: Number,
  manufacturer: String,
  availability: String
}, )

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const Beanie = mongoose.model('Beanie', productSchema)
const Facemask = mongoose.model('Facemask', productSchema)
const Gloves = mongoose.model('Gloves', productSchema)

module.exports = { Beanie, Facemask, Gloves }