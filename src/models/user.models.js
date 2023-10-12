import { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2'
import { cartModel } from "./cart.models.js";

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
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

userSchema.plugin(paginate) //Implementar el metodo paginate en el schema

userSchema.pre('save', async function(next) {
    try{
        const cart = await cartModel.create({})
        this.cart = cart._id
    }catch(error){
        next(error)
    }
})

export const userModel = model('users', userSchema)