

export const register = async (req, res) => {
    try {

        res.send({message: "Product not found", payload: "register"});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Product could not be loaded"});
    }
    
}

export const login = async (req, res) => {
    try {

        res.send({message: "Success productCreated.message", payload: "login"});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Product could not be added"});
    }
    
}

export const getCurrent = async (req, res) => {
    try {

        res.send({message: "Success productUpdated.message", payload: "getCurrent"});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Product could not be uploaded"});
    }
    
}


export const logout = async (req, res) => {
    try {

        res.send({message: "Success!", payload: "logout"});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Product could not be deleted"});
    }
    
}

export const restorePass = async (req, res) => {
    try {

        res.send({message: "Success!", payload: "restorePass"});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Password restored"});
    }
    
}
export const gitHubLogin = async (req, res) => {
    try {

        res.send({message: "Success!", payload: "gitHubCallBack"});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Product could not be deleted"});
    }
    
}
export const gitHubCallback = async (req, res) => {
    try {

        res.send({message: "Success!", payload: "gitHubCallBack"});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "Product could not be deleted"});
    }
    
}

/* *******************************************************************************************
******************************************************************************************* */

import userModel from '../dao/models/user.model.js';
import passport from 'passport';
import { createHash, passportCall, publicRouteMiddleware, generateJwtToken, privateRouteMiddleware } from '../util.js';

const router = Router();

router.post('/register', publicRouteMiddleware, passportCall('register'), async (req, res) => {
    res.status(201).json({
        status: "success",
        redirectUrl: '/users/login'
    });
})

router.post('/login', publicRouteMiddleware, passportCall('login'), async (req, res) => {

    const user = req.user;
    const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    }

    const access_token = generateJwtToken(tokenUser)
    console.log(access_token);
    
    res.cookie('jwtCookieToken', access_token, {
        maxAge: 180000,
        httpOnly: true
    });

    res.redirect('/products')
})

router.get('/current', passportCall('jwt'), async (req, res) => {

    console.log("User loggued: ");
    console.log(req.user);

    res.json({ payload: req.user });

})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('jwtCookieToken');
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
        age: user.age,
        role: "admin"
    };

    const access_token = generateJwtToken(req.session.user)
    console.log(access_token);
    
    res.cookie('jwtCookieToken', access_token, {
        maxAge: 180000,
        httpOnly: true
    });

    res.redirect("/github");
});
