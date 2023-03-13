
import mongoose from "mongoose";

const productsCollection = "products";

const stringRequired = {type: String, required: true};
const numberRequired = {type: Number, required: true};

const productsSchema = new mongoose.Schema({
    title: stringRequired,
    description: stringRequired,
    code: stringRequired,
    price: numberRequired,
    status: { type: Boolean, default: true, required: false},
    stock: numberRequired,
    category: stringRequired,
    thumbnails: {type: Array}
});

export const productsModel = mongoose.model(productsCollection,productsSchema);