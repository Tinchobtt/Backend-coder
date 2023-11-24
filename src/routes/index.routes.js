import { Router } from "express";
import productsRouter from "./products.routes.js";
import sessionRouter from "./session.routes.js";
import userRouter from "./users.routes.js";
import cartRouter from "./cart.routes.js";
import viewsRouter from "./views.routes.js";
import messagesRouter from "./messages.routes.js";
import mockingRouter from "./mocking.routes.js";

const router = Router()

router.use('/api/products', productsRouter)
router.use('/api/session', sessionRouter)
router.use('/api/users', userRouter)
router.use('/api/carts', cartRouter)
router.use('/static', viewsRouter)
router.use('/messages', messagesRouter)
router.use('/mockingProducts', mockingRouter)

export default router