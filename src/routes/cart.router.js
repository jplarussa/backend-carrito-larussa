import { Router} from "express";
import { getCart, createCart, updateProductQuantityToCart, deleteProductFromCart, emptyCart, purchaseCart } from '../controllers/carts.controller.js'

const router = Router();


router.get('/:cid', getCart);
router.post('/', createCart);
router.put('/:cid/product/:pid', updateProductQuantityToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', emptyCart);
router.get('/:cid/purchase', purchaseCart);

// router.put('/:cid/products/:pid', updateProductQuantityToCart);
// router.put('/:cid', updateCart); //ver este, en el otro como AddProductToCart

export default router;