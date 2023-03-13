
import mongoose from "mongoose";

const messagesCollection = "messages";

/* const stringRequired = {Type: String, required: true};
const numberRequired = {Type: Number, required: true}; */

const messagesSchema = new mongoose.Schema({
/*     title: stringRequired,
    description: stringRequired,
    code: stringRequired,
    price: numberRequired,
    status: {type: Boolean, required: false} || true,
    stock: numberRequired,
    category: stringRequired,
    thumbnails: {type: Array} */
});

export const messagesModel = mongoose.model(messagesCollection,messagesSchema);