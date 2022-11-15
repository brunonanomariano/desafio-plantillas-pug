const express = require('express')
const app = express()
const productsRouter = require('./routes/products')

const server = app.listen(8080, () => console.log('Server UP'))

app.use(express.json())
app.use(express.static('public'))
app.use('/api/productos', productsRouter)