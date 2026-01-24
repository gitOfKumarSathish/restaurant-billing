import { getAllMenuItemsService, getMenuItemByIdService } from "../services/menu.service.js";

class MenuController {
    constructor() {
        this.getAllMenuItems = this.getAllMenuItems.bind(this);
        this.getMenuItemById = this.getMenuItemById.bind(this);
    }
    async getAllMenuItems(req, res, next) {
        return await getAllMenuItemsService(res, req, next);
    }

    async getMenuItemById(req, res, next) {
        return await getMenuItemByIdService(res, req, next);
    }

    async createMenuItem(req, res, next) {
        return await createMenuItemService(res, req, next);
    }
    async updateMenuItem(req, res, next) {
        return await updateMenuItemService(res, req, next);
    }

    async deleteMenuItem(req, res, next) {
        return await deleteMenuItemService(res, req, next);
    }
}

export default new MenuController();