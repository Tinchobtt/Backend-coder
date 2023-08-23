import { Router } from "express";
import { ProductManager } from '../ProductManager.js';

const viewsRouter = Router()
const pm = new ProductManager('./src/products.json')

viewsRouter.get('/home', async (req, res)=>{
    const prods = await pm.getProducts()
    const products = prods.map(prod => {
        return {...prod, price: prod.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS'})}
    })
    res.render('home', {
        products
    })
})
viewsRouter.get('/products', async (req, res)=>{
    res.render('realTimeProducts')
})

export default viewsRouter