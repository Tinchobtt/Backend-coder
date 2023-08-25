import express from 'express'
import path from 'path'
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { ProductManager } from './ProductManager.js';
import chalk from 'chalk';

const PORT = 8080;
const app = express()

const server = app.listen(PORT, ()=>{
    console.log(`Server running on PORT: ${PORT}\n${chalk.yellow(`http://localhost:${PORT}/static/home`)}`);
})

//Middlewares
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

//Handlebars
app.use('/static', express.static(path.join(__dirname, '/public')))
app.engine('handlebars', engine()) //Defino que motor de plantillas voy a usar
app.set('view engine', 'handlebars') //Setting de mi app de hanblebars
app.set('views', path.resolve(__dirname, './views')) //Rutas absolutas a traves de rutas relativas

//Server Socket.io
const io = new Server(server);
const pm = new ProductManager('./src/products.json');

io.on('connection', (socket)=>{
    console.log('Socket.io Server Up!')
    socket.on('newProduct', async (newProduct)=>{
        let product = await pm.addProduct(newProduct)
        let products = await pm.getProducts();
        socket.emit('products', products, product)
    })
    socket.on('deleteProduct', async (id)=>{
        let confirm = await pm.deleteProduct(id);
        socket.emit('productDeleted', confirm)
    })
})

//ROUTES
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/static', viewsRouter)