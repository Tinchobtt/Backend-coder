import { Router } from "express";
import { productModel } from "../models/product.models.js";

const viewsRouter = Router()

viewsRouter.get('/home', async (req, res)=>{
    const products = await productModel.find().lean();
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
viewsRouter.get('/chat', async (req, res)=>{
    res.render('chat', {
        script: "js/chat.js"
    })
})

export default viewsRouter