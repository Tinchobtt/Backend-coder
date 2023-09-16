import { Router } from 'express';
import { cartModel } from '../models/cart.models.js';
import { productModel } from '../models/product.models.js';
 
const cartRouter = Router();

cartRouter.get('/', async (req, res)=>{
    try {
        const carts = await cartModel.find();
        if(carts){
            res.status(200).send({response: 'ok', message: carts})
        }else{
            res.status(404).send({response: 'error', message:'Not found'})
        }
    } catch (error) {
        res.status(400).send({response: 'Error trying to get de carts.', message: error});
    }
})

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
    try{
        const cart = await cartModel.findById(cid)
        if(cart){
            const product = await productModel.findById(pid);
            if(product){
                const index = cart.products.findIndex(prod => prod.id_prod === pid);
                if(index != -1){
                    cart.products[index].quantity = quantity; 
                }else{
                    cart.products.push({id_prod: pid, quantity: quantity})
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
        res.status(200).send({response: 'Cart created', message: cart})
    }catch(error){
        res.status(400).send({response: 'Error trying to create the cart.', message: error});
    }
})

cartRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;
    try {
        const cart = await cartModel.findById(cid, null, { skipPopulation: true }); // Evito el populate
        if (cart) {
            for (let prod of products) {
                let product = await productModel.findById(prod.id_prod);
                // Verifico si el producto existe
                if (product) {
                    let index = cart.products.findIndex(p => p.id_prod.toString() === product._id.toString());
                    // Verifico si el producto ya está en el carrito
                    if (index != -1) {
                        // Actualizamos nueva cantidad
                        cart.products[index].quantity = prod.quantity;
                    } else {
                        // Agregamos al carrito
                        cart.products.push(prod);
                    }
                }
            }
            await cartModel.findByIdAndUpdate(cid, cart);
            res.status(200).send({ response: 'ok', message: "Cart updated." });
        } else {
            res.status(404).send({ response: 'error', message: 'Cart not found.' });
        }
    } catch (error) {
        res.status(400).send({ response: 'Error trying to update the cart.', message: error });
    }
});


cartRouter.put('/:cid/products/:pid', async (req, res)=>{
    const {cid, pid} = req.params;
    const { quantity } = req.body;
    try{
        const cart = await cartModel.findById(cid);
        if(cart){
            const product = await productModel.findById(pid);
            if(product){
                const index = cart.products.findIndex(prod => prod.id_prod._id.toString() === pid)
                if(index != -1){
                    cart.products[index].quantity = quantity;
                    await cartModel.findByIdAndUpdate(cid, cart)
                    res.status(200).send({response: 'ok', message: 'Quantity modified.'})
                }else{
                    res.status(404).send({response: 'error', message: 'Product not found in the cart.'})
                }
            }else{
                res.status(404).send({response: 'error', message: 'Product not found.'})
            }
        }else{
            res.status(404).send({response: 'error', message: 'Cart not found.'})
        }

    }catch(error){
        res.status(400).send({response: 'Error trying to update the quantity.', message: error});
    }
})

cartRouter.delete('/:cid', async (req, res)=>{
    const { cid } = req.params
    try{
        const cart = await cartModel.findById(cid);
        if(cart){
            cart.products = [];
            await cartModel.findByIdAndUpdate(cid, cart);
            res.status(200).send({response: 'ok', message: cart});
        }else{
            res.status(404).send({response: 'error', message: 'Cart not found.'});
        }
    }catch(error){
        res.status(400).send({response: 'Error trying to delete the cart.', message: error});
    }
})

cartRouter.delete('/:cid/products/:pid', async (req, res)=>{
    const { cid, pid } = req.params;
    try{
        const cart = await cartModel.findById(cid);
        if(cart){
            const product = await productModel.findById(pid);
            if(product){
                cart.products = cart.products.filter(prod => prod.id_prod._id.toString() !== pid);
                await cartModel.findByIdAndUpdate(cid, cart);
                res.status(200).send({response: 'ok', message: 'Product deleted from the cart.'});
            }else{
                res.status(404).send({response: 'error', message: 'Product not found.'});
            }
        }else{
            res.status(404).send({response: 'error', message: 'Cart not found.'});
        }
    }catch(error){
        res.status(400).send({response: 'Error trying to delete the product of the cart.', message: error});
    }
})

export default cartRouter;