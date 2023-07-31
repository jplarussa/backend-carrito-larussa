import ProductsService from "../services/products.service.js";
import EmailService from "../services/emailservice.js";

const productsService = new ProductsService();
const emailService = new EmailService();

export const getProducts = async (req, res) => {
    try {

        const products = await productsService.getProducts(req.query);
        res.status(200).json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error loading the products. " + error.message });
    }

}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productsService.getProductById(productId);

        res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error searching the product. " + error.message });
    }

}

export const createProduct = async (req, res, next) => {
    try {
        let newProduct = req.body;
        if (req.user.role === "premium") {
            newProduct.owner = req.user.email;
        }
        let productCreated = await productsService.createProduct(newProduct);

        res.status(201).json(productCreated);

    } catch (error) {
        next(error);
    }

}

export const updateProduct = async (req, res) => {
    try {

        const productId = req.params.pid;
        const newProduct = req.body;

        const existProduct = await productsService.getProductById(productId)

        if (!existProduct) {
            return res.status(401).json({ status: "error", message: "The product doesn't exist" });
        }

        if (req.user.role === "premium" && req.user.email !== existProduct.owner) {
            return res.status(403).json({ status: "error", message: "Product Owner or Admin role required" });
        }

        let productUpdated = await productsService.updateProduct(productId, newProduct);

        res.status(200).json(productUpdated);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error updating product. " + error.message });
    }

}


export const deleteProduct = async (req, res) => {
    try {

        const productId = req.params.pid;

        const existProduct = await productsService.getProductById(productId)

        if (!existProduct) {
            return res.status(401).json({ status: "error", message: "The product doesn't exist" });
        }
        const premium = req.user.role === "premium"
        const existProductOwner = req.user.email === existProduct.owner;

        if (premium && !existProductOwner) {
            return res.status(403).json({ status: "error", message: "Product Owner or Admin role required" });
        }
        
        let productDeleted = await productsService.deleteProduct(productId);

        if (premium && existProductOwner) {
            const subject = `Your product ${existProduct.title} have been removed`
            const message = `<div style="display: flex; flex-direction: column; justify-content: center;  align-items: center;">
            Hello &nbsp;${existProduct.owner}!\nWe inform you that your product ${existProduct.title} have been removed by &nbsp;${req.user.email}.\nGreetings
            </div>`;
            await emailService.sendEmail(existProduct.owner, message, subject, (error, result) => {
                if(error){
                    throw {
                        error:  result.error, 
                        message: result.message
                    }
                }
            })
        }

        res.status(200).json(productDeleted);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error deleting product. " + error.message });
    }

}