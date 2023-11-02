import { Router } from 'express'
import { getProducts, getProductById, postProduct, putProductById, deleteProductById } from '../controllers/products.controller.js';
import { passportError, authorization } from '../utils/messageError.js';

const productsRouter = Router()

productsRouter.get('/', getProducts)
productsRouter.get('/:id', getProductById)
productsRouter.post('/', passportError('jwt'), authorization('admin'), postProduct)
productsRouter.put('/:id', passportError('jwt'), authorization('admin'), putProductById)
productsRouter.delete('/:id', passportError('jwt'), authorization('admin'), deleteProductById)

export default productsRouter