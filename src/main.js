import 'dotenv/config'
import express from 'express'
import path from 'path'
//Rutas
import router from './routes/index.routes.js';
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
//Logger
import { addLogger } from './config/logger.js';
//Documentacio
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUiExpress from 'swagger-ui-express'

const PORT = 8080;
const app = express()

mongoose.connect(process.env.MONGO_URL)
.then( async ()=>{ console.log('DB Connected') })
.catch((error)=>{ console.log(error) })

const server = app.listen(PORT, ()=>{
    console.log(`Server running on PORT: ${PORT}\n${chalk.yellow(`http://localhost:${PORT}/static/login`)}`);
})

//Middlewares
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use(addLogger)
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

const swaggerOpts = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'API Coder Backend',
            description: 'Documentacion del curso de backend'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`] //Indico la subcarpeta docs que no me interesa el nombre y luego busco el archivo que no me interesa el nombre pero si la extension
}
const specs = swaggerJSDoc(swaggerOpts)
app.use('/apidocs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))

//ROUTES
app.use('/', router)