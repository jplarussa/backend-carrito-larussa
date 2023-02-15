import express from "express";
import path from 'path';
import productsRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import __dirname from './util.js'


//Declare Express server.
const SERVER_PORT = 8080;
const app = express();

//Prepare server settings to receive JSON objects
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname +'/public')));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);


app.listen(SERVER_PORT, () => {
    console.log(`Servidor Express escuchando por el puerto: ${SERVER_PORT}`);
})