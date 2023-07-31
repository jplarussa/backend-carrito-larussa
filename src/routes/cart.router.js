import { Router } from "express";
import { passportCall } from "../util.js";
import { getCart, createCart, updateProductQuantityToCart, deleteProductFromCart, emptyCart, purchaseCart } from '../controllers/carts.controller.js'

const router = Router();

/* // Development test middleware to simulate req.user, then output
const simulateUserMiddleware = (req, res, next) => {
    // Mock the req.user object according to your needs
    req.user = {
        first_name: 'Jean',
        last_name: 'Pierre',
        email: 'jplarussa@gmail.com',
        age: 50,
        role: 'premium',
        cart: "648813092e1f7c47f5418791"
    };

    next();
}; */

router.get('/:cid', getCart);
router.post('/', createCart);
router.put('/:cid/products/:pid', passportCall('jwt'), updateProductQuantityToCart);
router.delete('/:cid/products/:pid', passportCall('jwt'), deleteProductFromCart);
router.delete('/:cid', emptyCart);
router.get('/:cid/purchase', passportCall('jwt'), purchaseCart);

export default router;