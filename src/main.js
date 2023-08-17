import express from 'express'
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';

const PORT = 8080;
const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

//ROUTES
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
})