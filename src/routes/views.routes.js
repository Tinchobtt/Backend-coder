import { Router } from "express";
import { productModel } from "../models/product.models.js";

const viewsRouter = Router()

//Middleware para verificar si es admin
const auth = (req, res, next)=>{
    if(req.session.email === "adminCoder@coder.com" && req.session.password === "adminCod3r123"){
        return next()
    }
    return res.redirect('/static/home', 301, {})
}

const isLogged = (req, res, next) => {
    if (req.session.login) {
        return next();
    } else {
        return res.redirect('/static/login');
    }
};

viewsRouter.get('/home', isLogged, async (req, res)=>{
    const products = await productModel.find().lean();
    res.render('home', {
        products,
        script: ''
    });
})
viewsRouter.get('/realTimeProducts', auth, (req, res)=>{
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
    if (req.session.login) {
        return res.redirect('/static/home');
    } else {
        res.render('login', {
            script: "js/login.js"
        });
    }
})
viewsRouter.get('/register', async (req, res)=>{
    res.render('register', {
        script: "js/register.js"
    })
})

export default viewsRouter