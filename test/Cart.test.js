import 'dotenv/config';
import mongoose from 'mongoose';
import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect
const requester = supertest('http://localhost:8080');

await mongoose.connect(process.env.MONGO_URL)

describe('Test Carts api/carts', function(){
    let cookie;

    it('Ruta: api/session/login con metodo POST', async () => {
        const user = {
            email: 'martin.benedetto07@gmail.com',
            password: 'martin.benedetto07@gmail.comMartin'
        }
        const result = await requester.post('/api/session/login').send(user)
        const resultCookie = result.headers['set-cookie'][0]

        expect(resultCookie).to.be.ok

        cookie = {
            name: resultCookie.split('=')[0],
            value: resultCookie.split('=')[1]
        }

        expect(cookie.name).to.be.ok.and.equal('jwtCookie')
        expect(cookie.value).to.be.ok
    })

    it('Ruta: api/carts - Agregar producto al carrito con metodo POST', async () => {
        const result = await requester.post('/api/carts/6576ff1560f6ba0b31b29276/products/64fc488ebe140cecfcdb0f97').set('Cookie', [`${cookie.name} = ${cookie.value}`]).send({quantity: 2})
        
        expect(result).to.be.ok
    })
})