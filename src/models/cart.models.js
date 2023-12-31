import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    products: {
        type: [
            {
                id_prod:{
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: true
                }
            }
        ],
        default: function (){
            return [];
        }
    }
})

cartSchema.pre('findOne', function() {
    if (!this.options.skipPopulation) {
        this.populate('products.id_prod');
    }
});

export const cartModel = model('carts', cartSchema)