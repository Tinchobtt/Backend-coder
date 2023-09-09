import { Router } from 'express';
import { cartModel } from '../models/cart.models.js';
import { productModel } from '../models/product.models.js';

const cartRouter = Router();

cartRouter.get('/:id', async (req, res)=>{
    const id = req.params.id;
    try {
        const cart = await cartModel.findById(id);
        if(cart){
            res.status(200).send({response: 'ok', message: cart})
        }else{
            res.status(404).send({response: 'error', message:'Not found'})
        }
    } catch (error) {
        res.status(400).send({response: 'Error trying to get de cart.', message: error});
    }
})

cartRouter.post('/:cid/products/:pid', async (req, res)=>{
    const {cid, pid} = req.params;
    const { quantity } = req.body;
    console.log(quantity)
    try{
        const cart = await cartModel.findById(cid)
        if(cart){
            const product = await productModel.findById(pid);
            if(product){
                const index = cart.products.findIndex(prod => prod.id_product === pid);
                if(index != -1){
                    cart.products[index].quantity = quantity; 
                }else{
                    cart.products.push({id_products: pid, quantity: quantity})
                }
                await cartModel.findByIdAndUpdate(cid, cart)
                res.status(200).send({response: 'ok', message: 'Product added.'})
            }else{
                res.status(404).send({response: 'error', message: 'Product not found.'})
            }
        }else{
            res.status(404).send({response: 'error', message: 'Cart not found.'})
        }
    }catch(error){
        res.status(400).send({response: 'Error trying to add the product to the cart.', message: error});
    }
})

cartRouter.post('/', async (req, res)=>{
    try{
        const cart = await cartModel.create({});
        res.status(200).send({response: 'ok', message: 'Cart created'})
    }catch(error){
        res.status(400).send({response: 'Error trying to create the cart.', message: error});
    }
})

export default cartRouter;