import {productsModel} from "../models/products.model.js"

export default class ProductManager {

    async getProducts() {
        try {
            let products = await productsModel.find();
            return products.map(product => product.toObject());
        } catch (error) {
            return error;
        }
    }

    async getProductById(productId) {
        try {
            const product = await productsModel.findById(productId);

            if (!product) {
                return {
                    success: false,
                    message: "Product not found - Try again"
                };
            }

            return {
                success: true,
                product
            };
        } catch (error) {
            return error.message;
        }
    }

    async addProduct(newproduct) {
        try {
            let product = await productsModel.create(newproduct);
            console.log(product);
            console.log(typeof(product));

            console.log("Product Added");
            return {
                success: true,
                message: `Product ${product.title} added successfully`
            };
        } catch (error) {
            return error;
        }
    }

    async deleteProduct(productId) {
        try {
            let result = await productsModel.deleteOne({_id: productId});
            console.log("Product Removed");
            return {
                success: true,
                message: `Product ID ${productId} deleted successfully`
            };
        } catch (error) {
            return error;
        }
    }

    async updateProduct(productId, productToReplace) {
        try {
            let product = await productsModel.updateOne({_id: productId},productToReplace);
            console.log("Product Modified");
            return {
                success: true,
                message: `Product ${productToReplace.title} edited successfully`
            };

        } catch (error) {
            console.log(error);
        }
    }
}
