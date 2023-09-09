import { Router } from "express";
import { messageModel } from "../models/message.models.js";

const messagesRouter = Router()

messagesRouter.get('/', async (req, res) =>{
    try{
        const messages = await messageModel.find();
        if(messages){
            res.status(200).send({response: 'ok', message: messages})
        }else{
            res.status(404).send({response: 'error', message: 'Not found'})
        }
    }catch(error){
        res.status(400).send({response: 'error', message: error})
    }
})

export default messagesRouter