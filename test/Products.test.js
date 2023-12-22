import 'dotenv/config'
import supertest from "supertest";
import chai from "chai";
import mongoose from "mongoose";

const expect = chai.expect
const requester = supertest('http://localhost:8080')

await mongoose.connect(process.env.MONGO_URL)

describe('Test CRUD product de la ruta api/products', function() {
    let cookie;
    let id;

    //Logueo al ADMIN
    it('Ruta: api/session/login con metodo POST', async () => {
        const user = {
            email: "adminCoder@coder.com",
            password: "admin123"
        }
        const result = await requester.post('/api/session/login').send(user)
        const cookieResult = result.headers['set-cookie'][0]
        
        expect(cookieResult).to.be.ok
        
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }

        expect(cookie.name).to.be.ok.and.equal('jwtCookie')
        expect(cookie.value).to.be.ok
    })

    it('Ruta: api/products - metodo POST', async () => {
        const newProduct = {
            title: "Nissan",
            description: 'GTR',
            price: 80000,
            code: 'NS882GTR',
            stock: 20,
            category: 'deportivo'
        }
        const {statusCode, _body, ok} = await requester.post('/api/products').set('Cookie', [`${cookie.name} = ${cookie.value}`]).send(newProduct)

        id = _body.message._id

        expect(ok).to.be.ok
    })

    it('Ruta: api/products - metodo GET', async () => {
        const { ok } = await requester.get(`/api/products/${id}`)

        expect(ok).to.be.ok
    })

    it('Ruta: api/products - metodo PUT', async () => {
        const updateProduct = {
            title: "Nissan",
            description: 'GTR',
            price: 80000,
            code: 'NS882GTR',
            stock: 30,
            category: 'deportivo'
        }
        const { ok } = await requester.put(`/api/products/${id}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]).send(updateProduct)

        expect(ok).to.be.ok
    })

    it('Ruta: api/products - metodo DELETE', async () => {
        const { ok } = await requester.delete(`/api/products/${id}`).set('Cookie', [`${cookie.name} = ${cookie.value}`])

        expect(ok).to.be.ok
    })
})