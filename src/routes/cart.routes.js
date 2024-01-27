import { Router } from 'express';
import { getCarts, getCartById, addProductToCart, createCart, updateCartById, updateProductFromCart, deleteCartById, deleteProductFromCart, purchase, clearCartById } from '../controllers/carts.controller.js';
import { authorization, passportError } from '../utils/messageError.js';
 
const cartRouter = Router();

cartRouter.get('/', getCarts)
cartRouter.get('/:id', getCartById)
cartRouter.post('/:cid/products/:pid', passportError('jwt'), addProductToCart)
cartRouter.post('/', createCart)
cartRouter.put('/:cid', updateCartById);
cartRouter.put('/:cid/products/:pid', passportError('jwt'), updateProductFromCart)
cartRouter.delete('/:cid', deleteCartById)
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart)
cartRouter.get('/:cid/purchase', passportError('jwt'), purchase)
cartRouter.get('/:cid/clearCart', clearCartById)

export default cartRouter;