import { productsModel } from "./models/products.model.js"

export default class ProductManager {

    async getProducts(filters, options) {
        return await productsModel.paginate(filters, options);
    }

    async getProductById(productId) {
        return await productsModel.findById(productId);
    }

    async addProduct(newproduct) {
        return await productsModel.create(newproduct);
    }

    async deleteProduct(productId) {
        return await productsModel.deleteOne({ _id: productId });
    }

    async updateProduct(productId, productToReplace) {
        return await productsModel.updateOne({ _id: productId }, productToReplace);
    }
}
