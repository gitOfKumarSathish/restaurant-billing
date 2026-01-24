import { Router } from "express";
import menuController from "../controllers/menuController.js";
const router = Router();

router.get('/all', menuController.getAllMenuItems);
export default router;