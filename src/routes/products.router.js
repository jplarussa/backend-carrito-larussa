import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js"
import RoleMiddleware from "../middlewares/role/role.middleware.js";
import { passportCall } from "../util.js";

const router = Router();

/* // Middleware de desarrollo para simular req.user, luego se saca
const simulateUserMiddleware = (req, res, next) => {
    // Simular el objeto req.user según tus necesidades
    req.user = {
        first_name: 'Jean',
        last_name: 'Pierre',
        email: 'jplarussa@gmail.com',
        age: 50,
        role: 'premium'
    };

    next();
}; */

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", /* simulateUserMiddleware , */ passportCall('jwt'), RoleMiddleware.isAdminOrPremium, createProduct)    
router.put("/:pid", passportCall('jwt'), RoleMiddleware.isAdminOrPremium, updateProduct);
router.delete("/:pid", passportCall('jwt'), RoleMiddleware.isAdminOrPremium, deleteProduct);

export default router;
