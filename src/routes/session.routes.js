import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageError.js";
import { register, login, logout, passwordRecovery, resetPassword, verifyToken } from "../controllers/session.controller.js";

const sessionRouter = Router()

sessionRouter.post('/register', passport.authenticate('register'), register)
sessionRouter.post('/login', passport.authenticate('login'), login)
sessionRouter.get('/logout', logout)

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {
    res.status(200).send({response: 'ok', message: 'User registered.'})
})

sessionRouter.get('/githubCallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({response: 'ok', message: 'User logued in.'})
})

sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req, res) => {
    res.send(req.user)
})

sessionRouter.get('/verifyToken', verifyToken)

sessionRouter.post('/password-recovery', passwordRecovery)
sessionRouter.post('/reset-password/:token', resetPassword)

export default sessionRouter