import { productsModel } from "./models/products.model.js"

export default class ProductDao {

    async getProducts(filters, options) {

        const products = await productsModel.paginate(filters, options);
        return products;
    }

    async getProductById(productId) {
        return await productsModel.findById(productId);
    }

    async createProduct(newproduct) {
        return await productsModel.create(newproduct);
    }
    
    async updateProduct(productId, productToReplace) {
        
        return await productsModel.findByIdAndUpdate(productId, productToReplace, {new: true});
    }
    
    async deleteProduct(productId) {
        return await productsModel.deleteOne({ _id: productId });
    }
}
