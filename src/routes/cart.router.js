import { Router} from "express";
import CartManager from "../CartManager.js";

const router = Router();

// Product manager initalizing
const cartManager = new CartManager();

router.post('/', async (request, response) => {
    
    try {

        let cartCreated = await cartManager.addCart();

        if (cartCreated.success) {            
            response.status(201).send({message: "Cart created successfully!"});
        } else {
            response.status(400).send({message: "Error: Something went wrong creating the cart."});
        }
        
    } catch (error) {
        response.status(500).send({error: "Error creating the cart.", message: error});
    }
});

router.post('/:cid/product/:pid', async (request, response) => {
    
    try {
        const cartId = parseInt(request.params.cid);
        const productId = parseInt(request.params.pid);
        const quantity = 1;
        const newProduct = { product: productId, quantity: quantity};

        let cartUpdate = await cartManager.addProductToCart(cartId, newProduct);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        response.status(500).send({error: "Error adding the product", message: error});
    }
});

router.get('/:cid', async (request, response) => {

    try {

        let carts = await cartManager.getCarts();
        const cart = await carts.find(c => c.id === parseInt(request.params.cid));
    
        if (cart) {
            response.send(`<html><body><h1>Producto: ${request.params.cid}</h1><ul><li>${JSON.stringify(cart)}</li></ul></body></html>`);
        } else {
            response.status(400).send({ message: "Cart not found" });
        }
        
    } catch (error) {
        response.status(500).send({error: "Error error searching the cart.", message: error});
    }

});


export default router;