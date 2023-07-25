let counter = 0;
const setCounter = ()=>{
    counter++;
    return counter
}

class ProductManager{
    constructor(){
        this.products = [];
    }
    addProduct(title, description, price, thumbnail, code, stock){
        //Creacion del objeto
        let product = {
            title, description, price, thumbnail, code, stock
        }
        //Validaciones
        if(!this.requiredFields(product)){
            console.log('Faltan datos del producto.');
            return;
        }
        if(this.repetedCode(product.code)){
            console.log(`Ya existe un producto con este codigo: ${product.code}.`);
            return;
        }

        //Todo correcto se procede a agregar el producto al array
        product.id = setCounter();
        this.products.push(product)
    }
    getProducts (){
        return this.products;
    }
    getProductById (id){
        let product = this.products.find( item => item.id === id);
        if(!product){
            console.log('Not Found')
        }
        return product
    }
    //Validations
    requiredFields = ({title, description, price, thumbnail, code, stock})=>{
        if(title && description && price && thumbnail && code && stock){
            return true
        }
        return false
    }
    repetedCode = (code) =>{
        return this.products.some( item => item.code === code);
    }
}

const pm = new ProductManager();