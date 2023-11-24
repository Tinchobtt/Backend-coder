import { faker } from '@faker-js/faker';

const modelFakerProduct = async () =>{
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({max: 100}),
        category: faker.commerce.productAdjective(),
        status: faker.datatype.boolean(),
        code: faker.finance.creditCardNumber,
        thumbnails: faker.image.avatar
    }
}

export const randomFakeProducts = async (cant) => {
    const fakeProducts = [];

    for(let i = 0; i < cant; i ++){
        const product = await modelFakerProduct();
        fakeProducts.push(product);
    }
    return fakeProducts;
}

// Diccionario de errores comunes
const erroresComunes = {
    'missing_field': 'Falta un campo obligatorio en la solicitud.',
    'invalid_data': 'Los datos proporcionados son inválidos.',
    'product_not_found': 'El producto no se encontró en la base de datos.',
};