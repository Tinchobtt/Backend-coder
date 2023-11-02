import { productModel } from "../models/product.models.js";

export const getProducts = async (req, res) => {
    const { limit, page, sort, category } = req.query;
    try{
        let query = {}
        if (category){
            query.category = category
        }
        const options = {
            limit: limit || 10, 
            page: page || 1, 
            sort: { price: sort ?? sort
        }}
        const products = await productModel.paginate(query, options)
        if(products){
            return res.status(200).send({response: 'ok', message: products})
        }
        res.status(404).send({response: 'error', message: 'Not Found.'})
    }catch(error){
        res.status(500).send({response: 'error', message: error})
    }
}

export const getProductById = async (req, res) => {
    const id = req.params.id;
    try{
        const product = await productModel.findById(id);
        if(product){
            return res.status(200).send({response: 'ok', message: product})
        }
        res.status(404).send({response: 'error', message: 'Not Found.'})
    }catch(error){
        res.status(500).send({response: 'error', message: error})
    }
}

export const postProduct = async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    try{
        const product = await productModel.create({ title, description, price, code, stock, category })
        if(product){
            return res.status(200).send({response: 'ok', message: 'Product created'})
        }
        res.status(400).send({response: 'error', message: 'Error trying to create the product.'})
        
    }catch(error){
        if(error.code == 11000){ //Error de llave duplicada
            return res.status(400).send({response: 'error', message: 'Error Duplicated key.'})
        }
        res.status(500).send({response: 'error', message: error})
    }
}

export const putProductById = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, code, stock, category, status } = req.body;
    try{
        const product = await productModel.findByIdAndUpdate(id, {title, description, price, code, stock, category, status})
        if(product){
            return res.status(200).send({response: 'ok', message: 'Product updated'})
        }
        res.status(404).send({response: 'error', message: 'Not Found'})
    }catch(error){
        res.status(500).send({response: 'Error trying to update the product', message: error})
    }
}

export const deleteProductById = async (req, res) => {
    const id = req.params.id;
    try{
        const product = await productModel.findByIdAndDelete(id)
        if(product){
            res.status(200).send({response: 'ok', message: 'Product deleted'})
        }
        res.status(404).send({response: 'error', message: 'Not Found'})
    }catch(error){
        res.status(500).send({response: 'Error trying to delete the product', message: error})
    }
}