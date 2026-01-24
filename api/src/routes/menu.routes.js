import { Router } from "express";
import menuController from "../controllers/menuController.js";
const router = Router();

router.get('/all', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.post('/create', menuController.createMenuItem);
router.put('/update/:id', menuController.updateMenuItem);
router.delete('/delete/:id', menuController.deleteMenuItem);

export default router;