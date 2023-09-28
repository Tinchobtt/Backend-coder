import local from 'passport-local'
import passport from 'passport'
import { createHash,validatePassword } from '../utils/bcrypt.js'
import { userModel } from '../models/user.models.js'
//Github strategy
import GithubStrategy from 'passport-github2'

//Defino la estrategia a utilizar
const localStrategy = local.Strategy
 
const initializePassport = () =>{
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
                    return done(null, false)
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
                    return done(null, user)
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