import { Router } from "express";
import { userModel } from "../models/user.models.js";

const sessionRouter = Router()

sessionRouter.post('/login', async (req, res)=>{
    const {email, password} = req.body
    try{
        if(req.session.login){
            return res.redirect('/static/home', 301, {})
        }
        const user = await userModel.findOne({email: email})
        if(user){
            if(user.password === password){
                req.session.login = true
                req.session.email = email
                return res.redirect('/static/home', 301, {})
            }else{
                res.status(401).send({response: 'error', message: 'Not authorized'})
            }
        }else{
            res.status(404).send({response: 'error', message: 'User not found.'})
        }
    }catch(error){
        res.status(400).send({response: 'error', message: error})
    }
})

sessionRouter.get('/logout', (req, res)=>{
    if(req.session.login){
        req.session.destroy()
    }
    return res.redirect('/static/login', 301, {})
})

export default sessionRouter
