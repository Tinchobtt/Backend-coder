import { noticeUserDelete } from "../config/nodemailer.js";
import { userModel } from "../models/user.models.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        if(users){
            return res.status(200).send({ response: 'ok', message: users })
        }
        res.status(404).send({response: 'error', message: 'Users not Found.'})
    } catch (error) {
        res.status(500).send({response: error, message: 'Error trying to get the users.' })
    }
}
export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user) {
            return res.status(200).send({ response: 'ok', message: user })
        }
        res.status(404).send({ response: 'error', message: 'User not Found.'})
    } catch (error) {
        res.status(500).send({ response: error, message: 'Error trying to get the user.' })
    }
}
export const updateUserById = async (req, res) => {
    const { id } = req.params
    const { name, surname, age, email, password } = req.body
    try {
        const user = await userModel.findByIdAndUpdate(id, { name, surname, age, email, password })
        if (user) {
            return res.status(200).send({ response: 'ok', message: user })
        }
        res.status(404).send({ response: 'Error', message: 'User not Found.' })
    } catch (error) {
        res.status(400).send({ response: error, message: 'Error trying to update the user.' })
    }
}
export const deleteUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            return res.status(200).send({ response: 'ok', message: user })
        }
        res.status(404).send({ response: 'error', message: 'User not Found.' })
    } catch (error) {
        res.status(400).send({ response: error, message: 'Error trying to delete the user' })
    }
}
export const loadDocuments = async (req, res) => {
    const { uid } = req.params
    const dataDocument = {
        name: req.file.originalname,
        reference: req.file.path
    }
    try{
        const user = await userModel.findById(uid)
        if(!user) return res.status(404).send({response: 'error', message: 'User not found.'})
        user.documents.push(dataDocument)
    
        const updatedUser = await userModel.findByIdAndUpdate(uid, user, {new: true})
        if(!updatedUser) return res.status(400).send({response: 'error', message: 'Error trying to upload the document.'})

        res.status(200).send({response: 'ok', message: 'Document uploaded.'})
    }catch(error){
        res.status(500).send({response: 'error', message: error.message})
    }
}
export const getInfoUser = async (req, res) => {
    try{
        const users = await userModel.find()
        if(!users) return res.status(404).send({response: 'error', message: 'Error trying to find the users.'})

        const infoUsers = users.map(user => {name: user.name; email: user.email; rol: user.rol })
    }catch(error){
        console.log(error);
    }
}
export const deleteUsers = async (req, res) => {
    try{
        const users = await userModel.find()
        if(!users) return res.status(404).send({response: 'error', message: 'Error trying to find the users.'})

        const inactiveUsers = users.filter(user => user.last_connection - Date.now >= 2)

        inactiveUsers.forEach(async user => {
            const deleteUser = await userModel.findByIdAndDelete(user._id)
            noticeUserDelete(deleteUser)
        })

    }catch(error){
        console.log(error);
    }
}