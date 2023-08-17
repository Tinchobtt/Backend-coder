import { promises as fs} from 'fs'
import { ProductManager } from './ProductManager.js';

export class CartManager{
    constructor(path){
        this.path = path;
    }
    async createCart(){
        const cart = new Cart();
        const carts = await this.getCarts();
        let nextId = products.length ? Math.max(...products.map(prod => prod.id)) + 1 : 1;
        cart.id = nextId;
        carts.push(cart)
        await fs.writeFile(this.path, JSON.stringify(carts, null, 4))
    }
    async getCarts(){
        try{
            return JSON.parse(await fs.readFile(this.path, 'utf-8'))
        }catch(err){
            return []
        }
    }
    async getCartProducts(id){
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === +id)
        return cart?.products
    }
    async addToCart(cid, pid){
        const cartProducts = await this.getCartProducts(cid)
        
        if(cartProducts){
            const pm = new ProductManager('./src/products.json')
            const product = await pm.getProductById(pid)
            if(product){
                const productInTheCart = cartProducts.find(prod => prod.id === pid)
                if(productInTheCart){
                    productInTheCart.quantity ++
                }else{
                    cartProducts.push({id: pid, quantity: 1})
                }
                const carts = await this.getCarts();
                const index = carts.findIndex(cart => cart.id === cid)
                carts[index].products = cartProducts
                await fs.writeFile(this.path, JSON.stringify(carts, null, 4))
                return product
            }else{
                return '- El producto seleccionado no existe.'
            }
        }else{
            return '- El carrito seleccionado no existe.'
        }
    }   
}

class Cart{
    constructor(){
        this.products = []
    }
}