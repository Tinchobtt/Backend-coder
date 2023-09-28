import { Router } from "express";
import passport from "passport";

const sessionRouter = Router()

sessionRouter.post('/register', passport.authenticate('register'), async (req, res)=>{
    try{
        if(!req.user){
            return res.status(400).send({response: 'error', message: 'This user already exists.'})
        }
        res.status(200).send({response: 'ok', message: 'User created.'})
    }catch(error){
        res.status(500).send({response: 'error', message: 'Error trying to create the user.'})
    }
})

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {
    res.status(200).send({response: 'ok', message: 'User registered.'})
})

sessionRouter.get('/githubCallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({response: 'ok', message: 'User logued in.'})
})

sessionRouter.post('/login', passport.authenticate('login'), async (req, res)=>{
    try{
        if(!req.user){
            return res.status(401).send({response: 'error', message: 'Invalidate user.'})
        }
        req.session.user = {
            name: req.user.name,
            email: req.user.email,
            age: req.user.age
        }
        req.session.login = true
        return res.redirect('/static/home', 301, {})
        // res.status(200).send({response: 'ok', message: req.user})
    }catch(error){
        res.status(500).send({response: 'error', message: error})
    }
})

sessionRouter.get('/logout', (req, res)=>{
    if(req.session.login){
        req.session.destroy()
    }
    return res.redirect('/static/login', 301, {})
})

export default sessionRouter
