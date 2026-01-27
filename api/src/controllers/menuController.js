import { createMenuItemService, deleteMenuItemService, getAllMenuItemsService, getMenuItemByIdService, updateMenuItemService } from "../services/menu.service.js";

class MenuController {
    constructor() {
        this.getAllMenuItems = this.getAllMenuItems.bind(this);
        this.getMenuItemById = this.getMenuItemById.bind(this);
        this.createMenuItem = this.createMenuItem.bind(this);
        this.updateMenuItem = this.updateMenuItem.bind(this);
        this.deleteMenuItem = this.deleteMenuItem.bind(this);
    }
    async getAllMenuItems(req, res, next) {
        return await getAllMenuItemsService(req, res, next);
    }

    async getMenuItemById(req, res, next) {
        return await getMenuItemByIdService(req, res, next);
    }

    async createMenuItem(req, res, next) {
        return await createMenuItemService(req, res, next);
    }
    async updateMenuItem(req, res, next) {
        return await updateMenuItemService(req, res, next);
    }

    async deleteMenuItem(req, res, next) {
        return await deleteMenuItemService(req, res, next);
    }
}

export default new MenuController();