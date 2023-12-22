import 'dotenv/config';
import mongoose from "mongoose";
import { userModel } from '../src/models/user.models.js';
import chai from 'chai';

const expect = chai.expect
let id;

await mongoose.connect(process.env.MONGO_URL)

describe('Test CRUD Users con chai - ruta: /api/users', function() { //Se usa function asi dentro podemos usar funciones flechas por temas de conflictos con el this
    it('Obtener todo los usuarios mediante metodo GET.', async () => {
        const users = await userModel.find()
        expect(Array.isArray(users)).to.be.ok //Si se cumple lo que esta dentro del expect pasa
        //expect(users).not.to.be.deep.equal([])
    })

    it('Obtener un usuario mediante metodo GET.', async () => {
        const user = await userModel.findById('6576ff1560f6ba0b31b29275')
        expect(user).to.have.property('_id')
    })

    it('Crear un usuario mediante metodo POST.', async () => {
        const user = await userModel.create({
            name: "Julieta",
            surname: 'Benedetto',
            email: 'juli.benedetto@gmail.com',
            age: 22,
            password: 'juli.benedetto@gmail.comJulieta'
        })
        id = user._id
        expect(user).to.have.property('_id')
    })

    it('Actualizar un usuario mediante metodo PUT.', async () => {
        const user = await userModel.findByIdAndUpdate(id, {age: 23}, {new: true})
        expect(user.age).to.be.equal(23)
    })

    it('Eliminar un usuario mediante metodo DELETE.', async () => {
        const ok = await userModel.findByIdAndDelete(id)
        expect(ok).to.be.ok
    })
})