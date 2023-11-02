import { Router } from 'express';
import { getCarts, getCartById, addProductToCart, createCart, updateCartById, updateProductFromCart, deleteCartById, deleteProductFromCart } from '../controllers/carts.controller';
 
const cartRouter = Router();

cartRouter.get('/', getCarts)
cartRouter.get('/:id', getCartById)
cartRouter.post('/:cid/products/:pid', addProductToCart)
cartRouter.post('/', createCart)
cartRouter.put('/:cid', updateCartById);
cartRouter.put('/:cid/products/:pid', updateProductFromCart)
cartRouter.delete('/:cid', deleteCartById)
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart)

export default cartRouter;