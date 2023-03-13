
import mongoose from "mongoose";

const productsCollection = "products";

const stringRequired = {Type: String, required: true};
const numberRequired = {Type: Number, required: true};

const productsSchema = new mongoose.Schema({
    title: stringRequired,
    description: stringRequired,
    code: stringRequired,
    price: numberRequired,
    status: {type: Boolean, required: false} || true,
    stock: numberRequired,
    category: stringRequired,
    thumbnails: {type: Array}
});

export const productsModel = mongoose.model(productsCollection,productsSchema);