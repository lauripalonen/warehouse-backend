const streamRouter = require('express').Router()
const dbTools = require('../utils/databaseTools')

streamRouter.get("/", async (request, response) => {
  response.setHeader('Cache-Control', 'no-cache')
  response.setHeader('Content-Type', 'text/event-stream')
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.flushHeaders()

  const updates = await dbTools.getUpdates()
  if (updates) {
    const products = updates.map(product => {
      return { category: product.category, catalog: product.catalog }
    })
    console.log('STREAM: sending updates')
    response.write(`data: ${JSON.stringify(products)}\n\n`)
  } else {
    console.log('STREAM: no updates')
    response.write(`data: ${null}\n\n`)
  }

  response.on('close', () => {
    console.log('connection closed by client')
    response.end()
  })

})


module.exports = streamRouter