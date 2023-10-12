import 'dotenv/config'
import Jwt from "jsonwebtoken";

export const generateToken = (user) => {
    /*
    1° Parametro: Objeto asociado al token
    2° Parametro: Clave privada para el cifrado
    3° Parametro: Tiempo de expiración del token
    */
   const token = Jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '12h'})
   return token
}

export const authToken = (req, res, next) => {
    //Consultar al header para obtener el token
    const authHeader = req.headers.Autorization

    if(!authHeader){
        return res.status(401).send({error: 'Unauthorized user.'})
    }

    const token = authHeader.split('')[1] //Obtengo el token y descarto el Bearer
    Jwt.sign(token, process.env.JWT_SECRET, (error, credential) => {
        if(error){
            return res.status(403).send({error: 'Unauthenticaterd user. Invalid token.'})
        }
    })

    req
}

generateToken({
    "_id":"65159a9b05838d862bec1420",
    "name":"Martin",
    "surname":" ",
    "age":"18",
    "email":"martin.benedetto07@gmail.com",
    "password":"$2b$15$.Jn3do3SzizZmKwgOeGALuPkitvF2OHaqicKxmxqUp9Hw44/B6y.G",
    "rol":"user"
})