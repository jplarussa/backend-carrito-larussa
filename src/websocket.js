import { Server } from 'socket.io';
//import of the service for Products. (You can change to file system by swapping the commented line)
// import ProductManager from "../dao/fs/ProductManager.js";
import ProductManager from "./dao/db/products.dao.js";
import MessageManager from "./dao/db/message.dao.js"

const productManager = new ProductManager();
const messageManager = new MessageManager();
let io;

function setupWebSocket(server) {

    let messages = [];

    io = new Server(server);

    io.on("connection", (socket) => {

        req.logger.info(`Someone connected to the server`);

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

        // Chat sockets
        socket.on("message", data => {

            req.logger.info(`Data received: ${data}`);
            messages.push(data);
            io.emit("messageLogs", messages);
            uploadMessages(messages);
        });

        // Manage message logs in MongoDb
        async function uploadMessages(newMessages) {
            try {
                let uploadedMessages = await messageManager.addMessage(newMessages);
                req.logger.debug(messages);

                req.logger.info("Message Added");
                return {
                    success: true,
                    message: `Message added`
                };
            } catch (error) {
                return error;
            }
        }
        

        socket.on("userConnected", data => {
            req.logger.info(`User connected: ${data.user}`);
            socket.broadcast.emit("userConnected", data.user);
        });

    });
}

export { setupWebSocket, io };
