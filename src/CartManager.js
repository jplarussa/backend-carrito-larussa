import fs from "fs";
import path from "path";
import __dirname from './util.js'

class CartManager {
    constructor(filePath) {
        this.filePath = path.join(__dirname, 'data', 'carts.json');
        this.carts = [];
        this.nextId = 0;
    }

    //Adds a new empty cart array and saves it to the JSON file.
    async addCart() {
        try {

            const newCart = {
                id: 0,
                products: []
            }

            // Read the existing carts
            this.carts = await this.readCarts();

            //Check for id repeated
            this.nextId++;
            while (this.carts.some(p => p.id === this.nextId)) {
                this.nextId++;
            }
            newCart.id = this.nextId;

            this.carts.push(newCart);

            console.log("Creating Cart:");
            console.log(newCart);

            await this.saveCarts();
            return {
                success: true
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error creating new Cart: ${JSON.stringify(newCart)}, error detail: ${error}`);
        }
    }

    async addProductToCart(cartId, newProduct) {
        try {

            const { product, quantity } = newProduct;

            // Read the existing carts
            this.carts = await this.readCarts();
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                return {
                    success: false,
                    message: "Cart with the provided id doesn't exist"
                };
            } else {

                this.cart[cartId].products.push(newProduct)
                return {
                    success: true,
                    message: `${quantity} Products id: ${product} added to cart ${cartId}`
                };

                this.carts[cartId].products.quantity.push(newProduct)

                return {
                    success: true,
                    product
                };
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to get the product ${id}, error: ${error}`);
        }

    }

    async getCarts() {
        this.carts = await this.readCarts();
        return this.carts;
    }

    // Read the carts JSON
    async readCarts() {
        try {
            const directory = path.dirname(this.filePath);
            await fs.promises.mkdir(directory, { recursive: true });

            const data = await fs.promises.readFile(this.filePath, 'utf8');
            return JSON.parse(data);

        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.promises.writeFile(this.filePath, JSON.stringify([]));
                return [];
            }
            throw Error(`Error reading the carts, error detail: ${error}`);
        }
    }

    async saveCarts() {
        try {

            await fs.promises.writeFile(this.filePath, JSON.stringify(this.carts), 'utf8');

        } catch (error) {
            console.error(error.message);
            throw Error(`Error saving the file, error detail: ${error}`);
        }
    }

}

export default CartManager;