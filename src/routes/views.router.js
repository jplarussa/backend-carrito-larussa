import { Router } from "express";
//import of the service for Products. (You can change to file system by swapping the commented line)
// import ProductManager from "../dao/fs/ProductManager.js";
import ProductManager from "../dao/db/products.service.js";
import { io } from '../websocket.js'
import { productsModel } from "../dao/models/products.model.js"
import { cartsModel } from "../dao/models/carts.model.js"

const router = Router();

// Product manager initalizing
const productManager = new ProductManager();

router.get('/', async (request, response) => {
    try {
        let products = await productManager.getProducts();
        response.render("home", { productsToHtml: products });

    } catch (error) {
        response.status(500).send({ error: "Error ", message: error });
    }
});

router.get('/chat', (req, res) => {

    res.render("chat", { });

})

router.get('/products', async (request, response) => {
    
    const perPage = 10;
    const page = request.query.page || 1;
    
    try {
        const products = await productsModel.paginate({}, { page, limit: perPage, lean: true });

        response.render("products", {

            products: products.docs, 
            currentPage: products.page, 
            totalPages: products.totalPages
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ error: "Error ", message: error });
    }
});

router.get('/carts/:cid', async (request, response) => {
    
    const perPage = 10;
    const page = request.query.page || 1;
    
    try {
        const carts = await cartsModel.paginate({}, { page, limit: perPage, lean: true });

        response.render("carts", {

            carts: carts.docs, 
            currentPage: carts.page, 
            totalPages: carts.totalPages
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ error: "Error ", message: error });
    }
});


router.get('/realtimeproducts', async (request, response) => {
    try {
        response.render("realTimeProducts");

    } catch (error) {
        response.status(500).send({ error: "Error ", message: error });
    }
});

router.post('/realtimeproducts', async (request, response) => {
    try {
        let newProduct = request.body;

        let productCreated = await productManager.addProduct(newProduct);

        if (productCreated.success) {

            io.emit("update-products", await productManager.getProducts());

            response.status(201).send(productCreated.message);

        } else {
            response.status(400).send(productCreated.message);

        }

    } catch (error) {
        response.status(500).send({ error: "Error saving product.", message: error });
    }
});

router.put('/realtimeproducts/:pid', async (request, response) => {
    try {
        const productId = request.params.pid;
        let productFields = request.body;

        let productUpdated = await productManager.updateProduct(productId, productFields);

        if (productUpdated.success) {

            io.emit("update-products", await productManager.getProducts());

            response.status(201).send(productUpdated.message);

        } else {
            response.status(400).send(productUpdated.message);

        }

    } catch (error) {
        response.status(500).send({ error: "Error saving product.", message: error });
    }
});

router.delete('/realtimeproducts/:pid', async (request, response) => {
    try {
        const productId = request.params.pid;

        let productDeleted = await productManager.deleteProduct(productId)

        if (productDeleted.success) {

            io.emit("update-products", await productManager.getProducts());

            response.status(201).send(productDeleted.message);

        } else {
            response.status(400).send(productDeleted.message);

        }

    } catch (error) {
        response.status(500).send({ error: "Error saving product.", message: error });
    }
});

export default router;