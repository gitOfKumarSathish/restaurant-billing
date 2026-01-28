import { getOrdersService, getOrderByIdService } from "../services/order.service.js";

class OrderController {
    constructor() {
        this.getOrders = this.getOrders.bind(this);
        this.getOrderById = this.getOrderById.bind(this);
    }
    async getOrders(req, res, next) {
        return await getOrdersService(req, res, next);
    }

    async getOrderById(req, res, next) {
        return await getOrderByIdService(req, res, next);
    }
}

export default new OrderController();