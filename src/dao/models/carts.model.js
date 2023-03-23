
import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, default: 1 }
    }]
});


cartsSchema.pre(/^find/, function (next) {
    this.populate('products.productId');
    next();
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);