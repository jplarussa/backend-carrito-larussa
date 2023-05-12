import { Router } from 'express';
import { register, login, gitHubLogin, gitHubCallback, getCurrent, logout, restorePass } from '../controllers/auth.controller.js';
import { passportCall } from '../util.js';

const router = Router();

router.post("/register", passportCall('register'), register);
router.post("/login", passportCall('login'), login);
router.get("/github", gitHubLogin);
router.get("/githubcallback", gitHubCallback);

router.get("/current", getCurrent)  
router.post("/logout", logout);
router.post("/restore", restorePass);



export default router;