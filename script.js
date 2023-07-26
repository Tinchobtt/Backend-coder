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
            console.log('- Faltan datos del producto.\n');
            return;
        }
        if(this.repetedCode(product.code)){
            console.log(`- Ya existe un producto con este codigo: ${product.code}.\n`);
            return;
        }

        //Todo correcto se procede a agregar el producto al array
        product.id = setCounter();
        this.products.push(product)
        console.log('- Porducto agregado existosamente.\n');
    }
    getProducts (){
        return this.products;
    }
    getProductById (id){
        let product = this.products.find( item => item.id === id);
        if(!product){
            console.log('- Not Found\n');
            return;
        }else{
            console.log('- Se encontró coincidencia:');
            return product;
        }
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

//TESTS

//Se agregan dos autos diferentes
pm.addProduct('Ferrari', 'Superauto', 200000, 'imgFerrari', 'F711dr66', 6);
pm.addProduct('Audi', 'Deportivo', 20000, 'imgAudi', 'AR8S7TT', 12);

//Se agrega un auto con un code igual al anteriro
pm.addProduct('Renault', 'Urbano', 6000, 'imgRenault', 'AR8S7TT', 20);

//Se agrega un auto con propiedades faltantes
pm.addProduct('Chevrolet', '', 8000, 'imgChevrolet', 'CH55YL1', 18);

//Se busca un auto existente
console.log(pm.getProductById(1))

//Se busca un auto no existente
console.log(pm.getProductById(7))
