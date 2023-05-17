import { Router } from "express";
import { getProducts } from "../controllers/mock.controller";

const router = Router();

router.get("/", getProducts);

export default router;