import express from 'express'
import path from 'path'
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

const PORT = 8080;
const app = express()

const server = app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
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
const io = new Server(server)

io.on('connection', (socket)=>{
    console.log('Socket.io Server On!')
    socket.on('mensaje', (info)=>{
        console.log(info)
    })
})

//ROUTES
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/static', viewsRouter)