import { createHash, isValidPassword, generateJwtToken } from '../util.js';
import UserService from "../services/users.service.js";
import UserDTO from '../dao/DTO/user.dto.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import EmailService from '../services/emailservice.js';

const emailService = new EmailService();
const userService = new UserService();

export const register = async (req, res) => {
    try {
        req.logger.info(`User: ${req.user}`);
        res.status(201).json({
            message: 'Success',
            redirectUrl: '/users/login'
        });
    } catch (error) {
        req.logger.console.warn(`Register user error:  ${error}`);
        res.status(500).json({ error: error.message, message: 'Error registering user' });
    }
};


export const login = async (req, res) => {
    try {

        const user = req.user;

        const tokenUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        };

        const access_token = generateJwtToken(tokenUser);
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 1200000,
            httpOnly: true
        });

        await userService.changeLastConnection(user.email);

        res.status(200).json({ success: true, redirectUrl: '/products' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: "Error login user." });
    }
};


export const getCurrent = async (req, res) => {

    const user = new UserDTO(req.user)
    res.send(user);
}


export const logout = async (req, res, next) => {
    try {
        if (!req.user) {
        console.log("TODO MAL");

    }
        const user = req. user
        await userService.changeLastConnection(user.email);

        req.session.destroy();
        res.clearCookie('jwtCookieToken');
        req.logger.info('User logout');
        res.redirect('/users/login');
    } catch (error) {
        next(error)
    }
}

export const recoverPass = async (req, res) => {
    try {

        const { email } = req.body;
        const user = await userService.findOne(email);
        req.logger.info(`Creating a restore pass token for: ${email}`);

        if (!user) {
            return res.status(401).json({ status: 'error', error: "Can't find user." });
        }

        let restorePassToken = generateJwtToken(email, '1h')
        console.log(restorePassToken);

        const from = 'jplarussa@gmail.com';
        const subject = 'Restore password from JP Ecommerce';
        const message = `<div style="display: flex; flex-direction: column; justify-content: center;  align-items: center;">
        <h1>To reset your password click <a href="http://localhost:8080/users/recoverLanding/${restorePassToken}">here</a></h1>
        </div>`;
        emailService.sendEmail(from, email, message, subject, (error, result) => {
            if(error){
                throw {
                    error:  result.error, 
                    message: result.message
                }
            }
        })

        req.logger.info(`Password reset token was sent`);
        res.status(200).json({ status: "success", message: `Password reset token was sent` })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: 'Password could not be restored' });
    }
}

export const restorePass = async (req, res, next) => {
    try {

        const { token, password: newPassword } = req.body;

        const decodedToken = jwt.verify(token, config.jwtPrivateKey);

        if (!newPassword || newPassword.trim() === "") {
            return res.send({ status: "error", message: "The password cannot be empty" });
        }

        const email = decodedToken.user;
        const user = await userService.findOne(email);
        req.logger.info(`Check if user exist for: ${email}`);


        if (!user) {
            return res.status(401).json({ status: 'error', error: "Can't find user." });
        }

        if (isValidPassword(user, newPassword)) {
            return res.send({ status: "error", message: "The password cannot be the same" });
        }

        const hashedPass = createHash(newPassword)
        const result = await userService.updateUser({ email: email }, { password: hashedPass });

        return res.status(200).json({ status: "success", message: "The password was changed successfully." });

    } catch (error) {

        if (error.name == 'TokenExpiredError') {
            req.logger.warn('Token has expired.')
            return res.status(401).json({ error: 'Token has expired.' });
        }

        next(error)
    }
}


// export const gitHubLogin = passport.authenticate('github', { scope: ['user:email'] });

export const gitHubCallback = async (req, res) => {

    const user = req.user;

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: "admin"
    };

    const access_token = generateJwtToken(req.session.user);
    req.logger.http(`JWT Token: ${access_token}`);

    res.cookie('jwtCookieToken', access_token, {
        maxAge: 900000,
        httpOnly: true
    });

    res.redirect("/github");
};
