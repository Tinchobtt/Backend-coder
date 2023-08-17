import { Router } from 'express'
import { CartManager } from '../CartManager.js'

const cartRouter = Router();
const cm = new CartManager('./src/carts.json')

cartRouter.get('/', async (req, res)=>{
    try {
        const carts = await cm.getCarts()
        if(carts){
            res.status(200).send(carts);
        }else{
            res.status(404).send('- No hay carritos');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
})

cartRouter.get('/:id', async (req, res)=>{
    const id = parseInt(req.params.id);
    try {
        const products = await cm.getCartProducts(id)
        if(products){
            res.status(200).send(products);
        }else{
            res.status(404).send('- El carrito no existe');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
})

cartRouter.post('/', async (req, res)=>{
    try{
        await cm.createCart()
        res.status(200).send('- Carrito creado')
    }catch(error){
        res.status(500).send('Error interno del servidor');
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res)=>{
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    try{
        const result = await cm.addToCart(cid, pid);
        if(typeof(result) === 'string'){
            res.status(404).send(result);
        }else{
            res.status(200).send('- Product agregado exitosamente.')
        }
    }catch(error){
        res.status(500).send('Error interno del servidor');
    }
})


export default cartRouter;