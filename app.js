const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const productsRouter = require('./controllers/products')
const streamRouter = require('./controllers/stream')
const dbTools = require('./utils/databaseTools')

const app = express()

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(
  console.log('connected to MongoDB!')
).catch(error => {
  console.log('connection error: ', error.message)
})

dbTools.getDatabase().then(database => {
  database ? dbTools.getUpdates() : dbTools.initDatabase()
})

app.use(cors())
app.use(express.static('build'))
app.use('/api/products', productsRouter)
app.use('/api/stream', streamRouter)

module.exports = app
