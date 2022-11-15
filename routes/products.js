const express = require('express')
const { parse } = require('path')
const router = express.Router()

let products = []

router.get('/', (req, resp) => {
    resp.send(products)
})

router.get('/:id', (req, resp) => {
    let paramId = req.params.id
    let selected = products.find( item => item.id === parseInt(paramId))
    if(!selected){
        resp.status(404).send({error: "Producto no encontrado"})
    } else {
        resp.send({selected})
    }
})

const middlewareValidate = (req, resp, next) => {
    let product = req.body
    if (!product.title || !product.price || !product.thumbnail) return resp.status(400).send({err: "Data is required"})
    next()
}

router.post('/', middlewareValidate, (req, resp) => {
    let product = req.body
    let item = {}

    if (products.length === 0){
        item = { ...product, id: 1}
    } else {
        item = { ...product, id: products[products.length-1].id + 1 }
    }

    products.push(item)
    resp.send({message: "Product Added", item, products })
})

router.delete('/:id', (req, resp) => {
    let paramId = req.params.id
    let productoEncontrado = products.find (item => item.id === parseInt(paramId))
    if (productoEncontrado){
        let newProducts = products.filter( item => item.id != parseInt(paramId))
        products = []
        products = newProducts
        resp.send({message: "Producto eliminado", productoEncontrado})
    } else {
        resp.status(404).send({message: "Producto no encontrado" })
    }
})

router.put('/:id', middlewareValidate, (req, resp) => {
    let paramId = req.params.id
    let productsId = products.map( item => item.id)
    let productoEncontrado = productsId.indexOf (parseInt(paramId))
    console.log(productoEncontrado)
    if (productoEncontrado === -1 ){
        resp.status(404).send({message: "Producto no encontrado" })
    } else {
        let newProduct = req.body
        products[productoEncontrado].title = newProduct.title
        products[productoEncontrado].price = newProduct.price
        products[productoEncontrado].thumbnail = newProduct.thumbnail
        resp.send({message: "Producto actualizado", newProduct})
    } 
})

module.exports = router