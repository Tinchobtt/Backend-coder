import { Router } from 'express';
import { getCarts, getCartById, addProductToCart, createCart, updateCartById, updateProductFromCart, deleteCartById, deleteProductFromCart, purchase } from '../controllers/carts.controller.js';
import { authorization, passportError } from '../utils/messageError.js';
 
const cartRouter = Router();

cartRouter.get('/', getCarts)
cartRouter.get('/:id', getCartById)
cartRouter.post('/:cid/products/:pid', passportError('jwt'), addProductToCart)
cartRouter.post('/', createCart)
cartRouter.put('/:cid', updateCartById);
cartRouter.put('/:cid/products/:pid', passportError('jwt'),updateProductFromCart)
cartRouter.delete('/:cid', deleteCartById)
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart)
cartRouter.post('/:cid/purchase', purchase)

export default cartRouter;