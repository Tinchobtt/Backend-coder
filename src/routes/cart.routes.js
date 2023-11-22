import { Router } from 'express';
import { getCarts, getCartById, addProductToCart, createCart, updateCartById, updateProductFromCart, deleteCartById, deleteProductFromCart, purchase } from '../controllers/carts.controller.js';
 
const cartRouter = Router();

cartRouter.get('/', getCarts)
cartRouter.get('/:id', getCartById)
cartRouter.post('/:cid/products/:pid', addProductToCart)
cartRouter.post('/', createCart)
cartRouter.put('/:cid', updateCartById);
cartRouter.put('/:cid/products/:pid', updateProductFromCart)
cartRouter.delete('/:cid', deleteCartById)
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart)
cartRouter.post('/:cid/purchase', purchase)

export default cartRouter;