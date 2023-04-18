import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import passport from 'passport';
import { createHash, isValidPassword } from '../util.js';

const router = Router();

// Middleware for public routes
export const publicRouteMiddleware = (req, res, next) => {
    if (req.session.user) {
        console.log("Already logged in, redirect");
        return res.redirect('/products');
    }
    next();
};

// Middleware for private routes
export const privateRouteMiddleware = (req, res, next) => {
    if (!req.session.user) {
        console.log("Redirect to log in");
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
        password: createHash(password)
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
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).send({ status: "error", error: "Incorrect credentials." });
    }

    if (!isValidPassword(user, password)) {
        console.warn("Invalid credentials for user: " + email);
        return res.status(401).send({status:"error",error:"Incorrect credentials."});
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

router.post('/restore', publicRouteMiddleware, async (req, res) => {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email },);

    if (!user) {
        return res.status(401).send({ status: "error", error: "Can't find user." });
    }

    const newUser = {
        email: email,
        password: createHash(password)
    }
    console.log("NEWUSER: " + newUser);

    const result = await userModel.updateOne({ email: email }, newUser);

    res.status(200).send({ status: "success", message: `Password restored` })

})

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.redirect("/github");
});

export default router;