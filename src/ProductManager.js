import { promises as fs} from 'fs';

export class ProductManager{
    constructor(path){
        this.path = path;
    }

    async addProduct(product){

        const products = await this.getProducts();
        let producto = products.find( prod => prod.id === +product.id);

        //Validations
        if(!this.requiredFields(product)){
            console.log('- Faltan datos del producto.\n');
            return;
        }
        if(this.repetedCode(product.code, products)){
            console.log(`- Ya existe un producto con este codigo: ${product.code}.\n`);
            return;
        }


        if(producto){
            console.log('- Ya existe este producto.\n');
        }else{
            products.push(product)
            await fs.writeFile(this.path, JSON.stringify(products, null, 4))
            console.log('- Porducto agregado existosamente.\n');
        }
    }

    async getProducts(){
        try{
            return JSON.parse(await fs.readFile(this.path, 'utf-8'));
        }catch{
            return []
        }
    }

    async getProductById(id){
        const products = await this.getProducts();
        let product = products.find( prod => prod.id === +id)

        if(product){
            console.log(product)
        }else{
            console.log('Producto no encontrado')
        }
        return product;
    }

    async updateProduct(id, product){
        const products = await this.getProducts();
        let index = products.findIndex( prod => prod.id === +id)
        console.log(product)
        if(!this.requiredFields(product)){
            console.log('- Faltan datos del nuevo producto.\n');
            return;
        }
        if(this.repetedCode(product.code, products)){
            console.log(`- Ya existe un producto con este codigo: ${product.code}.\n`);
            return;
        }

        if(index != -1){
            products[index].title = product.title;
            products[index].description = product.description;
            products[index].price = product.price;
            products[index].code = product.code;
            products[index].stock = product.stock;
            products[index].thumbnail = product.thumbnail;
            await fs.writeFile(this.path, JSON.stringify(products, null, 4))
            console.log('- Producto actualizado.\n')
        }else{
            console.log('- Producto no encontrado.\n')
        }
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        let product = products.find( prod => prod.id === id);
        
        if(product){
            let newProducts = products.filter( prod => prod.id !== +id)
            await fs.writeFile(this.path, JSON.stringify(newProducts, null, 4))
            console.log('- Producto eliminado.\n')
        }else{
            console.log('- Producto no encontrado.\n')
        }
    }

    //Validations
    requiredFields ({title, description, price, thumbnail, code, stock}){
        if(title && description && price && thumbnail && code && stock){
            return true
        }
        return false
    }
    repetedCode(code, products){
        return products.some( item => item.code === code);
    }
}

class Product {
    constructor(title, description, price, code, stock, thumbnail) {
        this.title = title
        this.description = description
        this.price = price
        this.code = code
        this.stock = stock
        this.thumbnail = thumbnail
        this.id = Product.incrementarId()
    }
    static incrementarId() {
        if(this.idIncrement){
            this.idIncrement++;
        }else{
            this.idIncrement = 1
        }
        return this.idIncrement;
    }
}

// const pm = new ProductManager('./products.json');


//TESTS
// ((async ()=>{

//     //Se agregan dos autos diferentes
//     await pm.addProduct(new Product('Ferrari', 'Superauto', 200000, 'F711dr66', 6, 'imgFerrari'));
//     await pm.addProduct(new Product('Audi', 'Deportivo', 20000, 'AR8S7TT', 12, 'imgAudi'));

//     //Se agrega un auto con un code igual al anteriro
//     await pm.addProduct(new Product('Renault', 'Urbano', 6000, 'AR8S7TT', 20, 'imgRenault'));
    
//     //Se agrega un auto con propiedades faltantes
//     await pm.addProduct(new Product('Chevrolet', '', 8000, 'CH55YL1', 18, 'imgChevrolet'));
    
//     //Se busca un auto existente
//     await pm.getProductById(1)
    
//     //Se busca un auto no existente
//     await pm.getProductById(7)
    
//     //Se actualiza un producto
//     await pm.updateProduct(2, {title: 'Alfa Romeo', description: 'Deportivo', price: 18000, code: 'ARJ11R8', stock: 32, thumbnail: 'imgAlfaRomeo'})

//     //Se agrega un auto nuevo
//     await pm.addProduct(new Product('Mclaren', 'Superauto', 280000, 'MC74YY1', 7, 'imgMclaren'));

//     //Se elimina un auto
//     await pm.deleteProduct(5)
// }))()