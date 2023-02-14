import { Router} from "express";

const router = Router();

router.get('/', async (request, response) => {

    response.send("Estoy en cart GET");
});

router.post('/', async (request, response) => {

    response.send("Estoy en cart POST");
});

export default router;