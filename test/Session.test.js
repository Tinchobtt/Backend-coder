import 'dotenv/config'
import supertest from "supertest";
import chai from "chai";
import mongoose from "mongoose";

const expect = chai.expect
const requester = supertest('http://localhost:8080')


await mongoose.connect(process.env.MONGO_URL)

describe('Test Users Session api/session', function(){
    let cookie;
    
    it('Ruta: api/session/register con metodo POST', async () => {
        const newUser = {
            name: "Tobias",
            surname: 'Riccone',
            email: 'tobias.riccone@gmail.com',
            age: 22,
            password: 'tobias.riccone@gmail.comTobias'
        }
        const {ok} = await requester.post('/api/session/register').send(newUser)

        expect(ok).to.be.ok
    })

    it('Ruta: api/session/login con metodo POST', async () => {
        const user = {
            email: "martin.benedetto07@gmail.com",
            password: "martin.benedetto07@gmail.comMartin"
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

    it('Ruta: api/session/current con metodo GET', async () => {
        const { _body } = await requester.get('/api/session/current').set('Cookie', [`${cookie.name} = ${cookie.value}`])
        
        expect(_body.user.email).to.be.equal('martin.benedetto07@gmail.com')
    })
})