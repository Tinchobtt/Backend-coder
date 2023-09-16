import { Router } from 'express'
import { productModel } from '../models/product.models.js'

const productsRouter = Router()

productsRouter.get('/', async (req, res) =>{
    const { limit, page, sort, query } = req.query;
    try{
        // const products = await productModel.find().limit(limit);
        const options = {limit: limit || 10, page: page || 1, sort: { price: sort ?? sort}}
        const products = await productModel.paginate(query || {}, options)
        res.status(200).send({response: 'ok', message: products})
    }catch(error){
        res.status(404).send({response: 'error', message: error})
    }
})

productsRouter.get('/:id', async (req, res) =>{
    const id = req.params.id;
    try{
        const product = await productModel.findById(id);
        if(product){
            res.status(200).send({response: 'ok', message: product})
        }else{
            res.status(404).send({response: 'error', message: 'Not Found'})
        }
    }catch(error){
        res.status(400).send({response: 'error', message: error})
    }
})

productsRouter.post('/', async (req, res) =>{
    const { title, description, price, code, stock, category } = req.body;
    try{
        const product = await productModel.create({ title, description, price, code, stock, category })
        if(product){
            res.status(200).send({response: 'ok', message: 'Product created'})
        }else{
            res.status(400).send({response: 'error', message: 'Not Found'})
        }
    }catch(error){
        res.status(400).send({response: 'Error trying to create the product', message: error})
    }
})

productsRouter.put('/:id', async (req, res) =>{
    const { id } = req.params;
    const { title, description, price, code, stock, category, status } = req.body;
    try{
        const product = await productModel.findByIdAndUpdate(id, {title, description, price, code, stock, category, status})
        if(product){
            res.status(200).send({response: 'ok', message: 'Product updated'})
        }else{
            res.status(404).send({response: 'error', message: 'Not Found'})
        }
    }catch(error){
        res.status(400).send({response: 'Error trying to update the product', message: error})
    }
})

productsRouter.delete('/:id', async (req, res) =>{
    const id = req.params.id;
    try{
        const product = await productModel.findByIdAndDelete(id)
        if(product){
            res.status(200).send({response: 'ok', message: 'Product deleted'})
        }else{
            res.status(404).send({response: 'error', message: 'Not Found'})
        }
    }catch(error){
        res.status(400).send({response: 'Error trying to delete the product', message: error})
    }
})

export default productsRouter