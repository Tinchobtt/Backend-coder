import express from 'express'
import { ProductManager } from './ProductManager.js';

const PORT = 8080;
const app = express()
app.use(express.json())

const pm = new ProductManager('./src/products.json');

app.get('/', (req, res)=>{
    res.send('Server up!')
})

app.get('/products', async (req, res) => {
    const { limit } = req.query
    try {
        const products = await pm.getProducts()
        if(limit){
            let productsLimit = products.slice(0, limit)
            res.status(200).send(productsLimit);
        }else{
            res.status(200).send(products);
        }
    } catch (error) {
        console.error('Error leyendo el archivo:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const products = await pm.getProducts()
        const product = products.find( prod => prod.id === id)
        if(product){
            res.status(200).send(product);
        }else{
            res.status(404).send('El producto no existe');
        }
    } catch (error) {
        console.error('Error leyendo el archivo:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
})