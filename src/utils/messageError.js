import passport from "passport";

//Funcion general para generar errores en las estrategias de passport
export const passportError = (strategy) => { //Voy a enviar local, github o jwt
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error){
                return next(error) //Que la funcion que me llame va a responder ante el error
            }
            if(!user){
                return res.status(401).send({error: info.message ? info.message : info.toString()})
            }
            req.user = user
            next()
        })(req, res, next) //Esto es para que llame al midelware
    }
}

//Recibo un rol y establezco la capacidad del usuario
export const authorization = (rol) => {
    return async (req, res, next) => {
        if(!req.user){
            return res.status(401).send({error: 'Unauthorized user.'})
        }
        if(req.user.user.rol !== rol){
            return res.status(403).send({error: 'User does not have necessary permissions.'})
        }
        next()
    }
}