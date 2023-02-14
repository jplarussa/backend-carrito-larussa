import { Router} from "express";
import ProductManager from "../ProductManager.js";

const router = Router();

// Product manager initalizing
const productManager = new ProductManager();

router.get('/', async (request, response) => {
    try {
        let products = await productManager.getProducts();
        let limit = request.query.limit;
        let responseHTML = '<html><body><h1>Productos</h1><ul>';
        if (limit) {
            let limits = products.slice(0, limit);
            limits.forEach(p => {
                responseHTML += `<li>${JSON.stringify(p)}</li>`;
            });
        } else {
            products.forEach(p => {
                responseHTML += `<li>${JSON.stringify(p)}</li>`;
            });
        }
        responseHTML += '</ul></body></html>';
        response.send(responseHTML);
        
    } catch (error) {
        response.status(500).send({error: "Error loading the products.", message: error});
    }
});


router.get('/:pid', async (request, response) => {
    try {
        let products = await productManager.getProducts();
        const product = await products.find(p => p.id === parseInt(request.params.pid));
    
        if (product) {
            response.send(`<html><body><h1>Producto: ${request.params.pid}</h1><ul><li>${JSON.stringify(product)}</li></ul></body></html>`);
        } else {
            response.status(400).send({ message: "Product not found" });
        }
        
    } catch (error) {
        response.status(500).send({error: "Error error searching the product.", message: error});
    }
});

router.post('/', async (request, response) => {
    try {

        let newProduct = request.body;
        let productCreated = await productManager.addProduct(newProduct);

        if (productCreated.success) {            
            response.status(201).send({message: "Product created successfully! Product:" + newProduct.title});
        } else {
            response.status(400).send({message: "Error: Product already exists or not all fields have been completed."});
        }
        
    } catch (error) {
        response.status(500).send({error: "Error saving product.", message: error});
    }
});

router.put('/:pid', async (request, response) => {
    try {

        let productId = parseInt(request.params.pid);
        let productFields = request.body;

        let productUpdated = await productManager.updateProduct(productId, productFields);

        if (productUpdated.success) {            
            response.status(201).send({message: "Product updated successfully! Product:" + productFields.title});
        } else {
            response.status(400).send({message: "Product with the provided id doesn't exist."});
        }
        
    } catch (error) {
        response.status(500).send({error: "Error updating product.", message: error});
    }
});

router.delete('/:pid', async (request, response) => {
    try {

        let productId = parseInt(request.params.pid);

        let productDeleted = await productManager.deleteProduct(productId)

        if (productDeleted.success) {            
            response.status(201).send({message: "Product deleted successfully! Product ID:" + productId});
        } else {
            response.status(400).send({message: "Product with the provided id doesn't exist or something go wrong."});
        }
        
    } catch (error) {
        response.status(500).send({error: "Error updating product.", message: error});
    }
});


export default router;
