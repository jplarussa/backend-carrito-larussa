import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js"
import RoleMiddleware from "../middlewares/role/role.middleware.js";
import { passportCall } from "../util.js";

const router = Router();

/* // Development test middleware to simulate req.user, then output
const simulateUserMiddleware = (req, res, next) => {
    // Mock the req.user object according to your needs
    req.user = {
        first_name: 'cocoliso',
        last_name: 'cocoliso',
        email: 'jplarussa@gmail.com',
        age: 60,
        role: 'user'
    };

    next();
}; */

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", passportCall('jwt'), RoleMiddleware.isAdminOrPremium, createProduct)    
router.put("/:pid", passportCall('jwt'), RoleMiddleware.isAdminOrPremium, updateProduct);
router.delete("/:pid", passportCall('jwt'), RoleMiddleware.isAdminOrPremium, deleteProduct);

export default router;
