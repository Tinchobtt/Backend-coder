import { promises as fs } from 'fs';

export class ProductManager{
    constructor(path){
        this.path = path;
    }

    async addProduct({title, description, price, code, stock, category, thumbnail}){
        let product = new Product(title, description, price, code, stock, category, thumbnail)
        
        //ID Asignation
        const products = await this.getProducts()
        let nextId = products.length ? Math.max(...products.map(prod => prod.id)) + 1 : 1;
        product.id = nextId;

        //Validations
        if(!this.requiredFields(product)){
            return 'Faltan datos del producto.';
        }
        if(await this.getProductByCode(code)){
            return `Ya existe un porducto con este codigo: ${code}`;
        }

        products.push(product)
        await fs.writeFile(this.path, JSON.stringify(products, null, 4))
        return product
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
        return product;
    }

    async getProductByCode(code){
        const products = await this.getProducts();
        let product = products.find( prod => prod.code === code)
        return product;
    }

    async updateProduct(id, product){
        const products = await this.getProducts();
        let index = products.findIndex( prod => prod.id === +id)
        
        if(!this.requiredFields(product)){
            return 'Faltan datos del nuevo producto.';
        }
        if(await this.codeRepeted(id, product.code)){
            return `Ya existe un producto con este codigo: ${product.code}.`;
        }

        if(index != -1){
            products[index].title = product.title;
            products[index].description = product.description;
            products[index].price = product.price;
            products[index].code = product.code;
            products[index].stock = product.stock;
            products[index].category = product.category;
            products[index].status = product.status;
            products[index].thumbnail = product.thumbnail;
            await fs.writeFile(this.path, JSON.stringify(products, null, 4))
            return products[index]
        }else{
            return 'No se encontro el producto.'
        }
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        let product = products.find( prod => prod.id === +id);
        
        if(product){
            let newProducts = products.filter( prod => prod.id !== +id)
            return await fs.writeFile(this.path, JSON.stringify(newProducts, null, 4))
        }else{
            return 'Producto no encontrado.'
        }
    }

    //Validations
    requiredFields ({title, description, price, code, stock, category}){
        if(title && description && price && code && stock && category){
            return true
        }
        return false
    }
    async codeRepeted(id, code){
        const products = await this.getProducts();
        return products.some( prod => prod.code === code && prod.id !== id)
    } 
}

class Product {
    constructor(title, description, price, code, stock, category, thumbnail, status=true) {
        this.title = title
        this.description = description
        this.price = price
        this.code = code
        this.stock = stock
        this.category = category
        this.status = status
        this.thumbnail = thumbnail
    }
}

// const pm = new ProductManager('./src/products.json');

//TESTS
// ((async ()=>{

    //Se agregan dos autos diferentes
    // await pm.addProduct({title:'Ferrari', description: 'Superauto', price: 200000, code:'F711dr66', stock: 6, category: 'superauto', thumbnail: 'imgFerrari'});
    // await pm.addProduct({title:'Audi', description: 'deportivo', price: 20000, code:'AR8GH55', stock: 6, category: 'deportivo', thumbnail: 'imgAudi'});

    //Se agrega un auto con un code igual al anteriro
    // await pm.addProduct(new Product('Renault', 'Urbano', 6000, 'AR8S7TT', 20, 'imgRenault'));
    
    // //Se agrega un auto con propiedades faltantes
    // await pm.addProduct(new Product('Chevrolet', '', 8000, 'CH55YL1', 18, 'imgChevrolet'));
    
    // //Se busca un auto existente
    // await pm.getProductById(1)
    
    // //Se busca un auto no existente
    // await pm.getProductById(7)
    
    // //Se actualiza un producto
    // await pm.updateProduct(2, {title: 'Alfa Romeo', description: 'Deportivo', price: 18000, code: 'ARJ11R8', stock: 32, thumbnail: 'imgAlfaRomeo'})

    // //Se agrega un auto nuevo
    // await pm.addProduct(new Product('Mclaren', 'Superauto', 280000, 'MC74YY1', 7, 'imgMclaren'));

    // //Se elimina un auto
    // await pm.deleteProduct(5)
// }))()