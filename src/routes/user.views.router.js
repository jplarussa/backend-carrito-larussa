import {Router} from 'express';
import {privateRouteMiddleware, publicRouteMiddleware} from './sessions.router.js'

const router = Router();

router.get('/login', publicRouteMiddleware, (req, res)=>{

    res.render('login');
})

router.get('/register', publicRouteMiddleware, (req, res)=>{

    res.render('register');
})

router.get('/', privateRouteMiddleware, (req, res)=>{

    res.render('products', {
        user: req.session.user,
        admin: req.session.admin
    });
})


export default router;