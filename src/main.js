import 'dotenv/config'
import express from 'express'
import path from 'path'
//Rutas
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import messagesRouter from './routes/messages.routes.js';
import userRouter from './routes/users.routes.js';
import sessionRouter from './routes/session.routes.js';
//Socket.io
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import chalk from 'chalk';
//Para socket.io
import { productModel } from './models/product.models.js';
import { messageModel } from './models/message.models.js';
//Session
import session from 'express-session';
//Guardado de session en mongo
import MongoStore from 'connect-mongo';
//Pasport
import passport from 'passport';
import initializePassport from './config/passport.js';
import cookieParser from 'cookie-parser';

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
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, //Establezco que la conexion sea por URL
            useUnifiedTopology: true //Manejo de cluster de manera dinamica
        },
        ttl: 60 //Time To Live -> Duracion de la session en la BD (En segundos)
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false //Sirve para forzar la session aunq no haya ningun dato
}))
initializePassport() //Llamo a la estrategia
app.use(passport.initialize())  //La inicializo
app.use(passport.session()) //Inicializo las sessiones

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
    })
})

//ROUTES
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users', userRouter)
app.use('/messages', messagesRouter)
app.use('/static', viewsRouter)
app.use('/session', sessionRouter)