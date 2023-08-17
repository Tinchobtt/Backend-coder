import { Router } from 'express'
import { ProductManager } from '../ProductManager.js';

const productsRouter = Router()
const pm = new ProductManager('./src/products.json')

productsRouter.get('/', async (req, res)=>{
    const { limit } = req.query
    try {
        const products = await pm.getProducts()
        if(limit){
            let productsLimit = products.slice(0, limit)
            res.status(200).send(productsLimit);
        }else{
            res.status(200).send(products);
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
})

productsRouter.get('/:id', async (req, res)=>{
    const id = parseInt(req.params.id);
    try {
        const product = await pm.getProductById(id)
        if(product){
            res.status(200).send(product);
        }else{
            res.status(404).send('- El producto no existe');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
})

productsRouter.post('/', async (req, res)=>{
    try {
        const result = await pm.addProduct(req.body)

        if(typeof(result) === 'string'){
            res.status(400).send(result);
        }else{
            res.status(200).send('- Producto agregado exitosamente.');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
})

productsRouter.put('/:id', async (req, res)=>{
    const id = parseInt(req.params.id);
    try {
        const result = await pm.updateProduct(id, req.body)
        if(typeof(result) === 'string'){
            res.status(400).send(result);
        }else{
            res.status(200).send('- Producto actualizado exitosamente.');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
})

productsRouter.delete('/:id', async (req, res)=>{
    const id = parseInt(req.params.id);
    try {
        const result = await pm.deleteProduct(id)

        if(typeof(result) === 'string'){
            res.status(404).send(result);
        }else{
            res.status(200).send('- Producto eliminado exitosamente.');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
})

export default productsRouter