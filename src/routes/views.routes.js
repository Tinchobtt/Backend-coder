import { Router } from "express";
import { passportError, authorization } from "../utils/messageError.js";

const viewsRouter = Router()

viewsRouter.get('/home', async (req, res)=>{
    res.render('home', {
        script: 'js/home.js'
    });
})
viewsRouter.get('/realTimeProducts', passportError('jwt'), authorization('admin'), async (req, res)=>{
    res.render('realTimeProducts',{
        script: "js/index.js"
    })
})
viewsRouter.get('/chat', async (req, res)=>{
    res.render('chat', {
        script: "js/chat.js"
    })
})
viewsRouter.get('/login', async (req, res)=>{
    res.render('login', {
        script: "js/login.js"
    });
})
viewsRouter.get('/register', async (req, res)=>{
    res.render('register', {
        script: "js/register.js"
    })
})

export default viewsRouter