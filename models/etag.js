const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const eTagSchema = new mongoose.Schema({
  etag: String,
  target: String,
  name: String
}, )

module.exports = mongoose.model('Etag', eTagSchema)