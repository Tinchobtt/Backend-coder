import 'dotenv/config'
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'testingo.code.mb@gmail.com',
        pass: process.env.PASSWORD_EMAIL,
        authMethod: 'LOGIN'
    }
})

export const sendRecoveryEmail = (email, recoveryLink) => {
    const emailOpts = {
        from: 'testingo.code.mb@gmail.com',
        to: email,
        subject: 'Password Reset Link',
        text: `Click on the following link to reset the password: ${recoveryLink}` 
    }
    transport.sendMail(emailOpts, (error, info) => {
        if(error){
            console.log(error)
        }else{
            console.log('Email enviado correctamente')
        }
    })
}