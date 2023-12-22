import { generateToken } from "../utils/jwt.js";

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