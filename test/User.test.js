import 'dotenv/config'
import mongoose from "mongoose";
import { userModel } from '../src/models/user.models.js'
import  Assert  from "assert";

await mongoose.connect(process.env.MONGO_URL)
let id = undefined

describe('Test CRUD Users - ruta: /api/users', function() { //Se usa function asi dentro podemos usar funciones flechas por temas de conflictos con el this
    //Previo a comenzar el todo el test
    before( () => {
        console.log('Test de Users')
    })

    //Previo a comenzar cada uno de los test
    beforeEach( () => {
        console.log('Empezando Test:')
    })

    it('Obtener todo los usuarios mediante metodo GET.', async () => {
        const users = await userModel.find()
        Assert.strictEqual(Array.isArray(users), true)
    })

    it('Obtener un usuario mediante metodo GET.', async () => {
        const user = await userModel.findById('6576ff1560f6ba0b31b29275')
        // Assert.strictEqual(typeof user, 'object')
        Assert.ok(user._id)
    })

    it('Crear un usuario mediante metodo POST.', async () => {
        const user = await userModel.create({
            name: "Tobias",
            surname: 'Riccone',
            email: 'tobias.riccone@gmail.com',
            age: 22,
            password: 'tobias.riccone@gmail.comTobias'
        })
        id = user._id
        Assert.ok(user._id)
    })

    it('Actualizar un usuario mediante metodo PUT.', async () => {
        const user = await userModel.findByIdAndUpdate(id, {age: 23}, {new: true})
        Assert.strictEqual(user.age, 23)
    })

    it('Eliminar un usuario mediante metodo DELETE.', async () => {
        const ok = await userModel.findByIdAndDelete(id)
        Assert.ok(ok)
    })
})