import { Router } from 'express';
import userModel from '../dao/models/user.model.js';

const router = Router();

// Middleware for public routes
export const publicRouteMiddleware = (req, res, next) => {
    if (req.session.user) {
        console.log("Vete pa alla");
        return res.redirect('/products');
    }
    next();
};

// Middleware for private routes
export const privateRouteMiddleware = (req, res, next) => {
    if (!req.session.user) {
        console.log("A loguearse");
        return res.redirect('/users/login');
    }
    next();
};


router.post('/register', publicRouteMiddleware, async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body;
    console.log("Registering user: " + JSON.stringify(req.body));

    const userExists = await userModel.findOne({ email });
    
    console.log(userExists);

    if (userExists) {
        return res.status(400).send({ status: "error", message: "User already exist." })
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password
    }

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        user.role = 'admin';
    }

    const result = await userModel.create(user);
    res.status(201).json({
        status: "success",
        message: `User created successfully, ID: ${result.id}`,
        redirectUrl: '/users/login'
    });

})

router.post('/login', publicRouteMiddleware, async (req, res) => {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });

    if (!user) {
        return res.status(401).send({ status: "error", error: "Incorrect credentials." });
    }



    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    if (user.role === 'admin') {
        req.session.admin = true;
    }

    return res.redirect('/products');
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
    console.log("User logout");
});

export default router;