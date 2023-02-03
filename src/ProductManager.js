class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.id = null;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {

    constructor() {
        this.products = [];
        this.#dirPath = __dirname + "/data/";
        this.#filePath = this.#dirPath + "/Products.json";
        this.#fileSystem = require("fs");
        this.#idcounter = 1;
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Hey! All fields are required");
            return;
        }

        const productExists = this.products.find((product) => product.code === code)

        if (productExists) {
            console.log("Code id already exists");
            return;
        }
        let productoNuevo = new Product(
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        );
        productoNuevo.id = this.#idcounter;
        this.#idcounter++;
        console.log("Creando Producto:");
        console.log(productoNuevo);
        try {
            await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
            if (!this.#fileSystem.existsSync(this.#filePath)) {
                await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
            }
            let productosFile = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
            console.info("Archivo JSON obtenido desde archivo: ");
            console.log(productosFile);
            this.products = JSON.parse(productosFile);
            console.log("Productos encontrados: ");
            console.log(this.products);
            this.products.push(productoNuevo);
            console.log("Lista actualizada de productos: ");
            console.log(this.products);
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(this.products));
        } catch (error) {
            console.error(`Error creando producto nuevo: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
            throw Error(`Error creando producto nuevo: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductByCode(code) {
        const productByCode = this.products.find((product) => product.code === code)
        if (productByCode) {
            return productByCode;
        } else {
            return "Not found - Try again";
        }
    }
    updateProduct = async (code, newData) => {
        const index = this.products.findIndex(product => product.code === code);
        if (index === -1) {
            console.log("Product with the provided code doesn't exist");
            return;
        }

        const product = this.products[index];
        for (const key in newData) {
            if (newData.hasOwnProperty(key)) {
                product[key] = newData[key];
            }
        }

        try {
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(this.products));
        } catch (error) {
            console.error(`Error updating product with code ${code}: ${error}`);
            throw Error(`Error updating product with code ${code}: ${error}`);
        }
    };

    deleteProduct = async (code) => {
        const index = this.products.findIndex(product => product.code === code);
        if (index === -1) {
            console.log("Product with the provided code doesn't exist");
            return;
        }

        this.products.splice(index, 1);

        try {
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(this.products));
        } catch (error) {
            console.error(`Error deleting product with code ${code}: ${error}`);
            throw Error(`Error deleting product with code ${code}: ${error}`);
        }
    };
}

//PRUEBAS DE CODIGO
let productManager = new ProductManager();
let persistirProducto = async () => {
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 5);
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 5);
    await productManager.addProduct("Manzana", "Manzana Roja de la Rioja", 9, "/image1.jpg", "abc124", 10);
    await productManager.addProduct("Peras", "Peras que no desesperan", 15.99, "/image2.jpg", "abc125", 5);
    await productManager.addProduct("Cocos", "Cocos locos", 5.99, "/image29.jpg", "abc126", 5);
    let productos = await productManager.getProducts();
    console.log(`Productos encontrados en Product Manager: ${productos.length}`);
    console.log(productos);
    console.log("Buscando por codigo");
    console.log(productManager.getProductByCode("abc123"));
    await productManager.updateProduct("abc125", ["Peras", "Peras que no desesperan", 19.99, "/image2.jpg", "abc125", 4]);
    await productManager.deleteProduct("abc126");
};
persistirProducto();
