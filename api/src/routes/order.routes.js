import { Router } from "express";
import orderController from "../controllers/orderController.js";
const router = Router();

router.post('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

export default router;