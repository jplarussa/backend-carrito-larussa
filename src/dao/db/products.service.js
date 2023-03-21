import { productsModel } from "../models/products.model.js"

export default class ProductManager {

    async getProducts({ filter = {}, sort = "desc", limit, page }) {
        try {

            const pipeline = [];

            if (filter.category) {
                pipeline.push({ $match: { category: { $regex: new RegExp(filter.category, 'i') } } });
            }

            if (filter.status) {
                const statusValue = filter.status === 'true' ? true : filter.status === 'false' ? false : null;
                pipeline.push({ $match: { status: statusValue } });
            }

            if (sort) {
                const sortDirection = sort === 'desc' ? -1 : 1;
                pipeline.push({ $sort: { price: sortDirection } });
            }

            if (limit && page) {
                pipeline.push({ $skip: (page - 1) * limit });
                pipeline.push({ $limit: limit });
            }

            const products = await productsModel.aggregate(pipeline).exec();
            return products;

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
            console.log(typeof (product));

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
            let result = await productsModel.deleteOne({ _id: productId });
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
            let product = await productsModel.updateOne({ _id: productId }, productToReplace);
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
