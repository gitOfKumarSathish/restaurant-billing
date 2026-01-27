import { Router } from "express";
import menuController from "../controllers/menuController.js";
const router = Router();

router.post('/', menuController.createMenuItem);
router.get('/', menuController.getAllMenuItems);

router.get('/:id', menuController.getMenuItemById);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

export default router;