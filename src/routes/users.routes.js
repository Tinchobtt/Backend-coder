import { Router } from "express";
import { getUsers, getUserById, updateUserById, deleteUserById,loadDocuments } from "../controllers/users.controller.js";
import { upload } from "../config/multer.js";

const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', updateUserById)
userRouter.delete('/:id', deleteUserById)
userRouter.post('/:uid/documents', upload.single('document'), loadDocuments) //document es la key para el formulario donde se envie el archivo

export default userRouter