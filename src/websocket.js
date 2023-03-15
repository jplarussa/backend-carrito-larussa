import { Server } from 'socket.io';
//import of the service for Products. (You can change to file system by swapping the commented line)
// import ProductManager from "../dao/fs/ProductManager.js";
import ProductManager from "./dao/db/products.service.js";

const productManager = new ProductManager();
let io;

function setupWebSocket(server) {
    io = new Server(server);

    io.on("connection", (socket) => {

        console.log("Someone connected to the server");

        // Emit Initial products
        (async () => {
            const products = await productManager.getProducts();
            socket.emit("update-products", products)
        })();

        socket.on("update-products", (updatedProducts) => {
            updateProductList(updatedProducts);
        });

        // Manage update events
        async function updateProductList(updatedProducts) {
            io.emit("update-products", updatedProducts);
        }
    });
}

export { setupWebSocket, io };