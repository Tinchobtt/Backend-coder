import { Router } from "express";
import { ProductManager } from '../ProductManager.js';

const viewsRouter = Router()
const pm = new ProductManager('./src/products.json')

viewsRouter.get('/home', async (req, res)=>{
    const prods = await pm.getProducts()
    const products = prods.map(prod => {
        return {...prod, price: prod.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
    })
    res.render('home', {
        products,
        script: ''
    })
})
viewsRouter.get('/realTimeProducts', (req, res)=>{
    res.render('realTimeProducts',{
        script: "js/index.js"
    })
})

export default viewsRouter