import fs from "fs";
import path from "path";
import __dirname from './util.js'

class ProductManager {
    constructor(filePath) {
        this.filePath = path.join(__dirname, 'data', 'Products.json');
        this.products = [];
        this.nextId = 0;
    }

    //Adds a new product to the products array and saves it to the JSON file.
    async addProduct(newProduct) {
        try {

            if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock) {
                console.error("Hey! All fields are required");
                return;
            }

            this.products = await this.readProducts();
            if (this.products.some(p => p.code === newProduct.code)) {
                console.error("Code id already exists");
                return;
            }

            //Check for id repeated
            this.nextId++;
            while (this.products.some(p => p.id === this.nextId)) {
                this.nextId++;
            }
            newProduct.id = this.nextId;

            this.products.push(newProduct);

            console.log("Creating Product:");
            console.log(newProduct);

            await this.saveProducts();

        } catch (error) {
            console.error(error.message);
            throw Error(`Error creating new product: ${JSON.stringify(newProduct)}, error detail: ${error}`);
        }
    }

    async getProducts() {
        this.products = await this.readProducts();
        return this.products;
    }

    async getProductById(id) {
        try {

            this.products = await this.readProducts();
            const product = this.products.find(p => p.id === id);
            if (!product) {
                return {
                    success: false,
                    message: "Not found - Try again"
                };
            }
            return {
                success: true,
                product
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error while trying to get the product ${id}, error: ${error}`);
        }
    }

    async updateProduct(id, product) {
        try {

            this.products = await this.readProducts();
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: "Product with the provided code doesn't exist"
                };
            }
            this.products[index] = { ...this.products[index], ...product };
            await this.saveProducts();
            return {
                success: true
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error updating product with code ${id}: ${error}`);
        }
    }

    async deleteProduct(id) {
        try {

            this.products = await this.readProducts();
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) {
                return {
                    success: false,
                    message: "Product with the provided code doesn't exist"
                };
            }
            this.products.splice(index, 1);
            await this.saveProducts();
            return {
                success: true
            };

        } catch (error) {
            console.error(error.message);
            throw Error(`Error deleting the product, error detail: ${error}`);
        }
    }

    async readProducts() {
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
            throw Error(`Error reading the products, error detail: ${error}`);
        }
    }

    async saveProducts() {
        try {

            await fs.promises.writeFile(this.filePath, JSON.stringify(this.products), 'utf8');

        } catch (error) {
            console.error(error.message);
            throw Error(`Error saving the file, error detail: ${error}`);
        }
    }
}

export default ProductManager;
/* 
// TESTEO DE APP

const manager = new ProductManager();

const product1 = {
    title: "Apple",
    description: "A delicious red apple",
    price: 0.5,
    thumbnail: "https://www.example.com/apple.jpg",
    code: "001",
    stock: 100
};

const product2 = {
    title: "Banana",
    description: "A sweet yellow banana",
    price: 0.3,
    thumbnail: "https://www.example.com/banana.jpg",
    code: "002",
    stock: 150
};

const product3 = {
    title: "Orange",
    description: "A juicy orange fruit",
    price: 0.4,
    thumbnail: "https://www.example.com/orange.jpg",
    code: "003",
    stock: 75
};

const product4 = {
    title: "Peach",
    description: "A sweet and juicy peach",
    price: 0.6,
    thumbnail: "https://www.example.com/peach.jpg",
    code: "004",
    stock: 50
};

const product5 = {
    title: "Kiwi",
    description: "A fuzzy green kiwi",
    price: 0.7,
    thumbnail: "https://www.example.com/kiwi.jpg",
    code: "005",
    stock: 200
};

const product6 = {
    title: "Pineapple",
    description: "A sweet and juicy pineapple",
    price: 1,
    thumbnail: "https://www.example.com/pineapple.jpg",
    code: "006",
    stock: 75
};

const product7 = {
    title: "Mango",
    description: "A sweet and juicy mango",
    price: 0.9,
    thumbnail: "https://www.example.com/mango.jpg",
    code: "007",
    stock: 100
};

const product8 = {
    title: "Cherry",
    description: "A sweet and juicy cherry",
    price: 0.2,
    thumbnail: "https://www.example.com/cherry.jpg",
    code: "008",
    stock: 200
};

const product9 = {
    title: "Strawberry",
    description: "A sweet and juicy strawberry",
    price: 0.5,
    thumbnail: "https://www.example.com/strawberry.jpg",
    code: "009",
    stock: 150
};

const product10 = {
    title: "Blueberry",
    description: "A sweet and juicy blueberry",
    price: 0.8,
    thumbnail: "https://www.example.com/blueberry.jpg",
    code: "010",
    stock: 100
};

const updatedProduct10 = {
    title: "Banana updated",
    description: "Yellow sweet fruit, now with a different title",
    price: 0.5,
    thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    code: "b10",
    stock: 20
};

async function test() {
    const pm = new ProductManager();

    let group = [product1, product2, product3, product4, product5, product6, product7, product8, product9, product10];
    for (let product of group) {
        await pm.addProduct(product);
    }


    const products = await pm.getProducts();
    console.log(products);

    const productToGet = await pm.getProductById(9);
    console.log(productToGet);

    const updatedProduct = await pm.updateProduct(9, updatedProduct10);
    console.log(updatedProduct);

    const productsAfterUpdate = await pm.getProducts();
    console.log(productsAfterUpdate);

    const deletedProduct = await pm.deleteProduct(8);
    console.log(deletedProduct);

    const productsAfterDelete = await pm.getProducts();
    console.log(productsAfterDelete);
}

test(); */