import { Router} from "express";
import { getCart, createCart, updateProductQuantityToCart, deleteProductFromCart, updateCart, emptyCart } from '../controllers/carts.controller.js'

const router = Router();


router.get('/:cid', getCart);//listo
router.post('/', createCart);//listo
router.put('/:cid/product/:pid', updateProductQuantityToCart);//listo
router.delete('/:cid/products/:pid', deleteProductFromCart);//listo
router.delete('/:cid', emptyCart);//listo
router.post('/:cid/purchase', purchaseCart);

// router.put('/:cid/products/:pid', updateProductQuantityToCart);
// router.put('/:cid', updateCart); //ver este, en el otro como AddProductToCart

export default router;