import { randomFakeProducts } from "../utils/fakerProducts.js";

export const getFakerProducts = async (req, res) => {
    try{
        const fakerProducts = await randomFakeProducts(100);
        console.log(fakerProducts)
        res.status(200).send({response: 'ok', message: fakerProducts})
    }catch(error){
        res.status(500).send({response: 'error', message: 'Error trying to create Faker Products.'})
    }
}