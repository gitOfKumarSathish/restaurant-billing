import { getOrdersService, getOrderByIdService, getStatusService, getAllOrdersService } from "../services/order.service.js";

class OrderController {
    constructor() {
        this.getOrders = this.getOrders.bind(this);
        this.getOrderById = this.getOrderById.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async getOrders(req, res, next) {
        return await getOrdersService(req, res, next);
    }

    async getOrderById(req, res, next) {
        return await getOrderByIdService(req, res, next);
    }

    async getAllOrders(req, res, next) {
        return await getAllOrdersService(req, res, next);
    }

    async getStats(req, res, next) {
        return await getStatusService(req, res, next)
    }
}

export default new OrderController();