import { getOrdersService } from "../services/order.service.js";

class OrderController {
    constructor() {
        this.getOrders = this.getOrders.bind(this);
    }
    async getOrders(req, res, next) {
        return await getOrdersService(req, res, next);
    }
}

export default new OrderController();