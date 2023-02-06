import fs from "fs";
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
    products;
    #dirPath;
    #filePath;
    #fileSystem;
    static idcounter = 1;

    constructor() {
        this.products = [];
        this.#dirPath = "./data/";
        this.#filePath = this.#dirPath + "/Products.json";
        this.#fileSystem = fs;
    }


    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Hey! All fields are required");
            return;
        }

        const productExists = this.products.find((product) => product.code === code)

        if (productExists) {
            console.log("*** ERROR *** Code id already exists");
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

        productoNuevo.id = ProductManager.idcounter;
        ProductManager.idcounter++;

        console.log("Creating Product:");
        console.log(productoNuevo);

        try {
            await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
            if (!this.#fileSystem.existsSync(this.#filePath)) {
                await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
            }

            let productosFile = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
            console.info("JSON obtained from file: ");
            console.log(productosFile);

            let data = JSON.parse(productosFile);

            if (data && data.products) {
                this.products = [...data.products];
                ProductManager.idcounter = data.idcounter;

                console.log("Products found: ");
                console.log(this.products);

            } else {
                console.error('No products were found in the archive.');
            }

            this.products.push(productoNuevo);

            console.log("Updated list of products: ");
            console.log(this.products);

            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify({ products: this.products, idcounter: ProductManager.idcounter }));

        } catch (error) {

            console.error(`Error creating new product: ${JSON.stringify(productoNuevo)}, error detail: ${error}`);
            throw Error(`Error creating new product: ${JSON.stringify(productoNuevo)}, error detail: ${error}`);
        }
    }

    getProducts = async () => {
        try {
            let productosFile = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");

            console.info("JSON obtained from file: ");
            console.log(productosFile);

            let data = JSON.parse(productosFile);
            this.products = data.products;
            ProductManager.idcounter = data.idcounter;

            console.log("Products found: ");
            console.log(this.products);

            return this.products;

        } catch (error) {

            console.error(`Error while trying to read the products, error detail: ${error}`);
            throw Error(`Error while trying to read the products, error detail: ${error}`);

        }
    }

    getProductByCode(code) {
        const productByCode = this.products.find((product) => product.code === code)
        if (productByCode) {
            return productByCode;
        } else {
            return "Not found - Try again";
        }
    }

    updateProduct = async (code, newProduct) => {
        const index = this.products.findIndex(product => product.code === code);
        if (index === -1) {
            console.log("Product with the provided code doesn't exist");
            return;
        }
        console.log(`Updating the product ${JSON.stringify(this.products[index].title)}`);
        this.products[index] = { ...this.products[index], ...newProduct, id: this.products[index].id };

        try {
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify({ products: this.products, idcounter: ProductManager.idcounter }));
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
        console.log(`Deleting the product ${JSON.stringify(this.products[index].title)}`);
        this.products.splice(index, 1);

        try {
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(this.products));
        } catch (error) {
            console.error(`Error deleting product with code ${code}: ${error}`);
            throw Error(`Error deleting product with code ${code}: ${error}`);
        }
    };
}

/* export default ProductManager; */
/* 
 GENERADOR PRODUCTOS Y PRUEBAS DE CODIGO */

let productManager = new ProductManager();
let persistirProducto = async () => {
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 5);
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 5);
    await productManager.addProduct("Manzana", "Manzana Roja de la Rioja", 9, "/image1.jpg", "abc124", 10);
    await productManager.addProduct("Peras", "Peras que no desesperan", 15.99, "/image2.jpg", "abc125", 5);
    await productManager.addProduct("Cocos", "Cocos locos", 5.99, "/image29.jpg", "abc126", 5);
    /*     await productManager.addProduct("Cocos2", "Cocos locos2", 17.99, "/image30.jpg", "abc127", 5);
        await productManager.addProduct("Ciruela", "Ciruela dulce", 8.99, "/image31.jpg", "abc128", 15);
        await productManager.addProduct("Naranja", "Naranja de jugo", 2.5, "/image32.jpg", "abc129", 25);
        await productManager.addProduct("Sandia", "Sandia sabrosa", 10.99, "/image33.jpg", "abc130", 10);
        await productManager.addProduct("Melon", "Melon rocio de miel", 8.12, "/image34.jpg", "abc131", 4);
        await productManager.addProduct("Huevos", "Huevos x 12", 70, "/image35.jpg", "abc132", 500);
        await productManager.addProduct("Lechuga", "Lechuga criolla", 14.1, "/image36.jpg", "abc133", 50); */
    /*     let productos = await productManager.getProducts();
        console.log(`Productos encontrados en Product Manager: ${productos.length}`);
        console.log(productos);
        console.log("Buscando por codigo");
        console.log(productManager.getProductByCode("abc123"));
        await productManager.updateProduct("abc125", {title: "Peras", description: "Peras que no desesperan", price: 19.99, thumbnail: "/image2.jpg", code: "abc125", stock: 4});
        console.log(productos);
        await productManager.deleteProduct("abc126");
        console.log(productos);
        await productManager.updateProduct("abc124", {title: "Manzana Verde"});
        console.log(productos); */
};
persistirProducto();