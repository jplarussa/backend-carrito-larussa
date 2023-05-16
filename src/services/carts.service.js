import CartDao from "../dao/db/carts.dao.js";
import ProductsService from "./products.service.js";
import TicketService from "./tickets.service.js";

const cartsDao = new CartDao();
const productService = new ProductsService();
const ticketService = new TicketService();

export default class CartsService {

    async getCart(id) {
        if (!id) throw new Error('Product ID is required.');

        const cart = await cartsDao.getCart(id);
        return cart;
    }

    async createCart() {
        const cart = await cartsDao.createCart();
        return cart;
    }

    async updateQuantity(cartId, productId, quantity) {

        if (!cartId) throw new Error('Cart ID is required.');
        if (!productId) throw new Error('Product ID is required.');

        quantity = quantity || 1;
        if (isNaN(quantity) || quantity <= 0) {
            throw new Error('Quantity must be a positive number.');
        }

        const productInCart = await cartsDao.findProduct(cartId, productId);
        console.log(productInCart)

        if (!productInCart) {

            const updatedCart = await cartsDao.addProduct(cartId, productId, quantity);
            return updatedCart;
            
        } else {

            const updatedCart = await cartsDao.updateQuantity(cartId, productId, quantity);
            return updatedCart;
        }
    }

    async deleteProductFromCart(id, pid) {

        if (!id) throw new Error('Cart ID is required.');
        if (!pid) throw new Error('Product ID is required.');

        const cart = await cartsDao.deleteProduct(id, pid);
        return cart;
    }

    async emptyCart(id) {
        if (!id) throw new Error('Cart ID is required.');

        const cart = await cartsDao.emptyCart(id);
        return cart;
    }

    async purchaseCart(id, user) {

        if (!id) throw new Error('Cart ID is required.');
        const purchaser = user.email;

        let cart = await cartsDao.getCart(id);
        if (!cart.products.length) throw new Error('Cart is empty')

        const notProcessed = []
        let total = 0;

        cart.products.forEach(async item => {
            if (item.quantity <= item.productId.stock) {
                let updatedStock = item.productId.stock - item.quantity;
                productService.updateProduct(item.productId.id, { stock: updatedStock })

                total += item.quantity * item.productId.price;

                await cartsDao.deleteProduct(id, item.productId.id);

            } else {

                notProcessed.push(item.productId.id)
            };
        })

        if (total == 0) {
            return notProcessed;
        }

        let ticket = ticketService.createTicket({ total, purchaser });

        // No supe resolver para mandar ambas cosas
        // si hago { ticket, notProcessed } o [ticket, not Processed ], no me muestra el ticket en mi end
        // esta solucion tampoco: ticket.not_processed = notProcessed;

        return ticket;
    }
}


/*     async addProductToCart(id, list) {
        if (!id) throw new Error('Cart ID is required.');

        list.forEach(async (data) => {
            let { product, quantity } = data;

            if (!product) throw new Error('Product ID is required.');
            if (quantity && isNaN(quantity)) throw new Error('Quantity must be a number.')

            // -- checks if the product is already in the cart, to not accidentally add twice.
            const productInCart = await cartsDao.findProduct(id, product);
            if (productInCart) {
                await cartsDao.updateQuantity(id, product, quantity || 1);
            } else {
                await cartsDao.addProduct(id, product, quantity || 1);
            }
        })

        return await cartsDao.getCart(id);
    } */