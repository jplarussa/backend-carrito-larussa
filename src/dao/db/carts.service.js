import { cartsModel } from "../models/carts.model.js"
import ProductManager from "./products.service.js";

export default class CartManager {
    constructor() {
        this.carts = cartsModel;
    }

    //Adds a new empty cart array and saves it to the JSON file.
    async addCart() {
        try {

            const newCart = { products: [] };

            const result = await this.carts.create(newCart);

            console.log("Creating Cart:");
            console.log(result);

            return {
                success: true,
                data: result
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error creating new Cart: ${JSON.stringify(newCart)}, error detail: ${error}`);
        }
    }

    async addProductToCart(cartId, productId) {
        try {

            const productManager = new ProductManager();

            // Check if the product exist
            const checkProduct = await productManager.getProductById(productId);
            if (!checkProduct.success) {
                return {
                    success: false,
                    message: `Product with id ${productId} not found.`,
                };
            }

            const cart = await this.carts.findById(cartId);

            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist"
                };

            } else {
                // Check if product already exists in cart
                let existingProduct = cart.products.find(p => p.productId === productId);

                if (existingProduct) {
                    // Add 1
                    existingProduct.quantity++;

                // Find the index of the existing product in the array
                const index = cart.products.findIndex(p => p.productId === productId);

                // Update the product in the database
                const result = await this.carts.updateOne(
                    { _id: cartId, "products.productId": productId },
                    { $set: { [`products.${index}.quantity`]: existingProduct.quantity } }
                );

                return {
                    success: true,
                    data: result,
                    message: `1 product with id ${productId} added to cart ${cartId}`
                };

                } else {
                    // Add new product to cart
                    const newProduct = { productId, quantity: 1 };
                    cart.products.push(newProduct);

                    const result = await cart.save();

                    return {
                        success: true,
                        data: result,
                        message: `1 product with id ${productId} added to cart ${cartId}`
                    };
                }
            }

        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to add the product id ${productId.product}, error: ${error}`);
        }

    }

    async getCarts() {

        const result = await this.carts.find();
        return result;
    }

}
