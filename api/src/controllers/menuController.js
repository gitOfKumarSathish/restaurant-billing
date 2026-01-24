import { getAllMenuItemsService } from "../services/menu.service.js";

class MenuController {
    constructor() {
        this.getAllMenuItems = this.getAllMenuItems.bind(this);
    }
    async getAllMenuItems(req, res, next) {
        return await getAllMenuItemsService(res, req, next);
    }
}

export default new MenuController();