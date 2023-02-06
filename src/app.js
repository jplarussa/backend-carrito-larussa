import express from "express";
import ProductManager from "./ProductManager.js";


const app = express();
app.use(express.urlencoded({extended: true}));
const SERVER_PORT = 8080;

const productManager = new ProductManager();


app.get('/products', async (request, response) => {
    let productos = await productManager.getProducts();
    let limit = request.query.limit;

    if (limit) {
        let limits = productos.slice(0,limit)
        response.send(JSON.stringify(limits));
    } else {
        response.send(JSON.stringify(productos));
    }
});

app.get('/products/:pid', async (request, response) => {

    let productos = await productManager.getProducts();
    const product = await productos.find( x => x.id ===  parseInt(request.params.pid));

    if (product) {
        response.send(product);
    } else {
        response.send({message: "Product not found"});
    }
});

app.listen(SERVER_PORT,() => {
    console.log(`Servidor Express escuchando por el puerto: ${SERVER_PORT}`);
})