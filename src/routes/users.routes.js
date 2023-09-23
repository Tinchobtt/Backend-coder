import { Router } from "express";
import { userModel } from "../models/user.models.js";

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send({ response: 'OK', message: users })
    } catch (error) {
        res.status(400).send({ response: 'Error en consultar usuarios', message: error })
    }
})

userRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user) {
            res.status(200).send({ response: 'OK', message: user })
        } else {
            res.status(404).send({ response: 'Error en consultar usuario', message: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ response: 'Error en consultar usuario', message: error })
    }
})

userRouter.post('/', async (req, res) => {
    const { name, surname, age, email, password } = req.body
    try {
        const user = await userModel.create({ name, surname, age, email, password })
        res.status(200).send({ response: 'ok', message: user, ok: true })
    } catch (error) {
        res.status(400).send({ response: 'Error en crear usuario', message: error })
    }
})

userRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { name, surname, age, email, password } = req.body
    try {
        const user = await userModel.findByIdAndUpdate(id, { name, surname, age, email, password })
        if (user) {
            res.status(200).send({ response: 'OK', message: user })
        } else {
            res.status(404).send({ response: 'Error trying to update the user', message: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ response: 'Error en actualizar usuario', message: error })
    }
})

userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            res.status(200).send({ response: 'OK', message: user })
        } else {
            res.status(404).send({ response: 'Error en eliminar usuario', message: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ response: 'Error trying to delete the user', message: error })
    }
})

export default userRouter