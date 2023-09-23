import { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2'

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        index: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user'
    }
})

userSchema.plugin(paginate) //Implementar el metodo paginate en el schema

export const userModel = model('users', userSchema)