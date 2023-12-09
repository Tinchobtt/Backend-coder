import { Router } from "express";
import { userModel } from "../models/user.models.js";
import { passportError, authorization } from '../utils/messageError.js';

const premiumRoute = Router();

premiumRoute.get('/', passportError('jwt'), authorization('user'), async (req, res) => {
    try{
        if(req.user){
            req.user.user.isPremium = true
            const updatedUser = await userModel.findByIdAndUpdate(req.user.user._id, req.user.user, {new: true})
            return res.status(200).send(updatedUser)
        }
        return res.status(403).send({response: 'error', message: 'Unauthorized.'})
    }catch(error){
        return res.status(500).send({response: 'error', message: error.message})
    }
})

export default premiumRoute