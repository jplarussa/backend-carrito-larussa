import { Router } from "express";
import { getCart, createCart, updateProductQuantityToCart, deleteProductFromCart, emptyCart, purchaseCart } from '../controllers/carts.controller.js'

const router = Router();

// Middleware de desarrollo para simular req.user, luego se saca
const simulateUserMiddleware = (req, res, next) => {
    // Simular el objeto req.user según tus necesidades
    req.user = {
        first_name: 'Jean',
        last_name: 'Pierre',
        email: 'jplarussa@gmail.com',
        age: 50,
        role: 'premium',
        cart: "648813092e1f7c47f5418791"
    };

    next();
};

router.get('/:cid', getCart);
router.post('/', createCart);
router.put('/:cid/product/:pid',simulateUserMiddleware, updateProductQuantityToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', emptyCart);
router.get('/:cid/purchase', simulateUserMiddleware, purchaseCart);

// router.put('/:cid/products/:pid', updateProductQuantityToCart);

export default router;