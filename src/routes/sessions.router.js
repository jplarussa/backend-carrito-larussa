import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import passport from 'passport';
import { createHash, isValidPassword, passportCall, publicRouteMiddleware } from '../util.js';

const router = Router();

router.post('/register', publicRouteMiddleware, passportCall('register'), async (req, res) => {
    res.status(201).json({
        status: "success",
        redirectUrl: '/users/login'
    });
})

router.post('/login', publicRouteMiddleware, passportCall('login'), async (req, res) => {

    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age
    }

    if (req.user.role === 'admin') {
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