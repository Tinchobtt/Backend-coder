import 'dotenv/config'
import { userModel } from '../models/user.models.js'
//passport
import local from 'passport-local'
import passport from 'passport'
//Encriptado
import { createHash,validatePassword } from '../utils/bcrypt.js'
//Github strategy
import GithubStrategy from 'passport-github2'
//jwt
import jwt from 'passport-jwt'

//Defino la estrategia a utilizar
const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Extrar de las cookies el token
 
const initializePassport = () =>{
    //Extrae la Cookie
    const cookieExtractor = req => {
        const token = req.cookies.jwtCookie ? req.cookies.jwtCookie : {}
        // console.log("cookieExtractor", token)
        return token
    }
    
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //El token va a venir desde cookieExtractor
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => { //jwt_payload = info del token (en este caso, datos del cliente)
        try {
            // console.log("JWT", jwt_payload)
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, //
            usernameField: 'email' //Como no usamos username definimos que el username va a ser el email
        },
        async (req, username, password, done) =>{
            //Registro de usuario
            const {name, surname, email, age} = req.body

            try{
                const user = await userModel.findOne({email: email})
                if(user){ //Caso error usuario existente
                    return done(null, false)  //done: primer atributo es el error
                }
                //Creo usuario
                const passwordHash = createHash(password)
                const userCreated = await userModel.create({name, surname, age, email, password: passwordHash})
                return done(null, userCreated)
            }catch(error){
                return done(error) 
            }
        }
    ))

    passport.use('login', new localStrategy(
        {
            usernameField: 'email' //Como no usamos username definimos que el username va a ser el email
        },
        async (username, password, done) =>{
            try{
                const user = await userModel.findOne({email: username})
                if(!user){
                    return done(null, false)
                }
                if(validatePassword(password, user.password)){
                    return done(null, user) // --> al mandar user passport lo convierte en req.user
                }
                return done(null, false)
            }catch(error){
                return done(error) 
            }
        }
    ))

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile._json)
            const user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                done(null, false)
            } else {
                const userCreated = await userModel.create({
                    name: profile._json.name,
                    surname: ' ',
                    email: profile._json.email,
                    age: 18, //Edad por defecto
                    password: createHash(profile._json.email + profile._json.name)
                })
                done(null, userCreated)
            }
        } catch (error) {
            done(error)
        }
    }))

    //Inicializar la session del user
    passport.serializeUser( (user, done) => {
        done(null, user._id)
    })
    //Eliminar la session del user
    passport.deserializeUser( async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport