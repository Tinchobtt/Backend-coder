import { generateToken } from "../utils/jwt.js";
import { sendRecoveryEmail } from "../config/nodemailer.js";
import { userModel } from "../models/user.models.js";
import { createHash } from "../utils/bcrypt.js";
import crypto from 'crypto'

const recoveryLinks = []

export const register = async (req, res) => {
    try{
        if(!req.user){
            return res.status(400).send({response: 'error', message: 'This user already exists.'})
        }
        res.status(200).send({response: 'ok', message: req.user})
    }catch(error){
        res.status(500).send({response: 'error', message: 'Error trying to create the user.'})
    }
}

export const login = async (req, res) => {
    try{
        if(!req.user){
            return res.status(401).send({response: 'error', message: 'Invalidate user.'})
        }
        // // JWT o SESSION
        // req.session.user = {
        //     name: req.user.name,
        //     email: req.user.email,
        //     age: req.user.age
        // }
        // req.session.login = true

        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, { maxAge: 43200000  }) //12 hs en segundos
        // return res.status(200).send({response: 'ok', message: req.user})

        return res.redirect('/static/home', 301, {response: 'ok', message: req.user})
    }catch(error){
        res.status(500).send({response: 'error', message: error})
    }
}
export const logout = async (req, res) => {
    // //Si manejo sesiones
    // if (req.session.login) {
    //     req.session.destroy()
    // }
    res.clearCookie('jwtCookie')
    // return res.status(200).send({ response: 'User logued out.' })
    return res.redirect('/static/login', 301, {response: 'ok', message: 'User logued out.'})
}

export const passwordRecovery = (req, res) => {
    //Enviar email
    const { email } = req.body

    try{
        const token = crypto.randomBytes(20).toString('hex') //Token unico para que no se repita
        recoveryLinks[token] = {email: email, timestamp: Date.now()}

        const recoveryLink = `http://localhost:8080/api/session/reset-password/${token}`
        sendRecoveryEmail(email, recoveryLink)

        res.status(200).send({response: 'ok', message: 'Email send.'})
    }catch(error){
        res.status(500).send({response: 'error', message: error.message})
    }
}
export const resetPassword = async(req, res) => {
    //Restaurar contraseña
    const {token} = req.params
    const {newPassword, repeatedPassword} = req.body

    try{
        const data = recoveryLinks[token]
        if(data && Date.now() - data.timestamp <= 3600000){
            const { email } = data
            if(newPassword === repeatedPassword){
                const encryptedPassword = createHash(newPassword)
                const user = await userModel.findOneAndUpdate({email: email}, {password: encryptedPassword})
                if(!user){
                    return res.status(404).send({response: 'error', message: 'User not found.'})
                }
                delete recoveryLinks[token]
                return res.status(200).send({response: 'ok', message: 'Password successfully reset.'})
            }else{
                res.status(400).send({response: 'error', message: 'Passwords must match. Try again.'})
            }
        }else{
            res.status(400).send({response: 'error', message: 'Invalid token or expired. Request a new link.'})
        }
    }catch(error){
        res.status(500).send({response: 'error', message: error.message})
    }
}