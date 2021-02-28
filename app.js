const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const productsRouter = require('./controllers/products')
const dbTools = require('./utils/databaseTools')

const app = express()

mongoose.connect(config.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('connected to MongoDB!')
    return result
  })
  .catch((error) => { console.log('error connecting to MongoDB: ', error.message) })

dbTools.databaseIsEmpty().then(isEmpty => {
  isEmpty ? dbTools.initDatabase() : console.log('server is already initialized')
})


app.use(cors())
app.use(express.static('build'))
app.use('/api/products', productsRouter)

app.get("/stream", (request, response) => {
  response.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  dbTools.checkForUpdates().then(updates => {
    if (updates) {
      console.log('Sending update to client')
      dbTools.updateDataBase(mongoose.connection.db).then(result => {
        const catalog = {
          category: 'beanies', products: result.beanies,
          category: 'facemasks', products: result.facemasks,
          category: 'gloves', prodocuts: result.gloves
        }
        response.json(catalog)
      }
      )
    }
  })

  request.on("close", (err) => {
    response.end()
  })
})

module.exports = app
