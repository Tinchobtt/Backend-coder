import 'dotenv/config'
import express from 'express'
import path from 'path'
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import messagesRouter from './routes/messages.routes.js';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import chalk from 'chalk';
//Para socket.io
import { productModel } from './models/product.models.js';
import { messageModel } from './models/message.models.js';

const PORT = 8080;
const app = express()

mongoose.connect(process.env.MONGO_URL)
.then( async ()=>{ console.log('DB Connected') })
.catch((error)=>{ console.log(error) })

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

io.on('connection', (socket)=>{
    console.log('Socket.io Server Up!')
    socket.on('newProduct', async (newProduct)=>{
        const product = await productModel.create(newProduct)
        socket.emit('products', product)
    })
    socket.on('deleteProduct', async (id)=>{
        const confirm = await productModel.findByIdAndDelete(id)
        socket.emit('productDeleted', confirm)
    })
    socket.on('message', async (newMessage)=>{
        await messageModel.create(newMessage)
        const messages = await messageModel.find();
        socket.emit('messages', messages)
        console.log(messages)
    })
})

//ROUTES
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/messages', messagesRouter)
app.use('/static', viewsRouter)