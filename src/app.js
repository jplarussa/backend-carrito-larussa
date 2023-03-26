import express from "express";
import path from 'path';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import __dirname from './util.js';
import {setupWebSocket} from './websocket.js';
import MongoStore from 'connect-mongo';
import { MONGODB_URI } from './config.js';
import session from 'express-session';

// Routers
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from './routes/views.router.js';
import usersViewsRouter from './routes/user.views.router.js';
import sessionsRouter from './routes/sessions.router.js';


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

//Session
app.use(session(
    {
        store: MongoStore.create({
            mongoUrl: MONGODB_URI,
            mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
            ttl: 120,
        }),
        secret: "Codigoxxx",
        resave: false,
        saveUninitialized: false
    }
))


// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/users", usersViewsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(SERVER_PORT, () => {
    console.log(`Express Server listening  on the port: ${SERVER_PORT}`);
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
