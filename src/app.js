import express from "express";
import path from 'path';
import __dirname from './util.js';
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from './routes/views.router.js';
import handlebars from 'express-handlebars';
import {setupWebSocket} from './websocket.js';
import { MONGODB_URI } from './config.js'; 


//Declare Express server.
const SERVER_PORT = 8080;
const app = express();

//Prepare server settings to receive JSON objects
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Define path for static content
app.use(express.static(path.join(__dirname +'/public')));

// Define the template engine and views
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views");

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(SERVER_PORT, () => {
    console.log(`Servidor Express escuchando por el puerto: ${SERVER_PORT}`);
})
// Initialize websocket Server
setupWebSocket(httpServer);

// Connect to MongoDb
const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connection to DB Succed");
    } catch (error) {
        console.log("Error on connection to DB"+error);
    }
}
connectMongoDB();
