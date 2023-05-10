import CartManager from "../dao/db/carts.dao.js";

const cartManager = new CartManager();

export const addCart = async (req, res) => {
    try {

        const cartCreated = await cartManager.addCart();
        res.status(201).send(cartCreated);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error creating the cart."});
    }
    
}

export const addProductToCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cartUpdate = await cartManager.addProductToCart(cartId, productId);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error adding the product to the cart"});
    }
    
}
export const getCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const result = await cartManager.getCart(cartId);

        res.status(201).send(result);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error error searching the cart."});
    }
    
}
export const deleteProductFromCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cartUpdate = await cartManager.deleteProductFromCart(cartId, productId);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error deleting the product in the cart"});
    }
    
}
export const updateCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const newProducts = req.body.products;

        const cartUpdate = await cartManager.updateCart(cartId, newProducts);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error updating products in the cart"});
    }
    
}
export const updateProductQuantityInCart = async (req, res) => {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const cartUpdate = await cartManager.updateProductQuantityInCart(cartId, productId, quantity);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error updating quantity in the cart"});
    }
    
}
export const emptyCart = async (req, res) => {
    try {

        const cartId = req.params.cid;

        const cartUpdate = await cartManager.emptyCart(cartId);

        res.status(201).send(cartUpdate);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Error emptying the cart"});
    }
    
}

/* ********************************************************************************************************************
********************************************************************************************************************
********************************************************************************************************************
********************************************************************************************************************
********************************************************************************************************************
 

//import of the service for Carts. (You can change to file system by swapping the commented line)
// import CartManager from "../dao/fs/CartManager.js";
import CartManager from "../dao/db/carts.dao.js";


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
        const cartId = request.params.cid;
        const productId = request.params.pid;

        let cartUpdate = await cartManager.addProductToCart(cartId, productId);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error adding the product to the cart"});
    }
});

router.get('/:cid', async (request, response) => {

    try {
        const cartId = request.params.cid;
        let result = await cartManager.getCart(cartId);

        if (result.success) {            
            response.status(200).send(result);
        } else {
            response.status(404).send(result);
        }
        
    } catch (error) {
        response.status(500).send({error: "Error error searching the cart.", message: error});
    }
});

router.delete('/:cid/products/:pid', async (request, response) => {

    try {
        const cartId = request.params.cid;
        const productId = request.params.pid;

        let cartUpdate = await cartManager.deleteProductFromCart(cartId, productId);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error deleting the product in the cart"});
    }

});

router.put('/:cid', async (request, response) => {

    try {
        const cartId = request.params.cid;
        let newProducts = request.body.products;

        let cartUpdate = await cartManager.updateCart(cartId, newProducts);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error updating products in the cart"});
    }

});

router.put('/:cid/products/:pid', async (request, response) => {

    try {
        const cartId = request.params.cid;
        const productId = request.params.pid;
        const quantity = request.body.quantity;

        let cartUpdate = await cartManager.updateProductQuantityInCart(cartId, productId, quantity);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error updating quantity in the cart"});
    }

});

router.delete('/:cid', async (request, response) => {

    try {
        const cartId = request.params.cid;

        let cartUpdate = await cartManager.emptyCart(cartId);

        if (cartUpdate.success) {            
            response.status(201).send(cartUpdate.message);
        } else {
            response.status(400).send(cartUpdate.message);
        }
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({error: "Error emptying the cart"});
    }

});
*/