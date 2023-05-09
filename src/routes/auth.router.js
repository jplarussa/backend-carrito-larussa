import { Router } from 'express';
import { register, login, getCurrent, logout, restorePass, gitHubLogin, gitHubCallback } from '../controllers/auth.controller.js';

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current", getCurrent)  
router.post("/logout", logout);
router.post("/restore", restorePass);
router.get("/github", gitHubLogin);
router.get("/githubcallback", gitHubCallback)  

export default router;