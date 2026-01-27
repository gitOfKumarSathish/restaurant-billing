import mongoose from "mongoose";
import Menu from "../models/menu.js";
import { createMenuItemSchema, updateMenuItemSchema } from "../validators/menuValidator.js";
import httpStatus from "http-status-codes";
const { StatusCodes: Status } = httpStatus;

const getAllMenuItemsService = async (req, res, next) => {
    try {
        const getAll = await Menu.find().select('-__v');
        if (!getAll || getAll.length === 0) {
            return res.status(Status.NOT_FOUND).json({ message: "No menu items found" });
        }
        return res.status(Status.OK).json({ message: "Menu items retrieved successfully", data: getAll });
    }
    catch (err) {
        next(err);
    }
};

const getMenuItemByIdService = async (req, res, next) => {
    try {

        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(Status.BAD_REQUEST).json({ message: "Invalid ID format" });
        }

        const menuItem = await Menu.findById(id).select('-__v');
        if (!menuItem) {
            return res.status(Status.NOT_FOUND).json({ message: "Menu item not found" });
        }
        return res.status(Status.OK).json({ message: "Menu item retrieved successfully", data: menuItem });
    } catch (err) {
        next(err);
    }
};

const createMenuItemService = async (req, res, next) => {
    try {
        // const { itemName, itemPrice, availabilityStatus, description } = createMenuItemSchema.parse(req.body);
        const menuItem = createMenuItemSchema.parse(req.body);
        if (!menuItem) {
            return res.status(Status.BAD_REQUEST).json({ message: "Invalid menu item data" });
        }
        await Menu.create(menuItem);
        return res.status(Status.CREATED).json({ message: "Menu item created successfully", data: menuItem });
    } catch (err) {
        next(err);
    }
};

const updateMenuItemService = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(Status.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
        const updateData = updateMenuItemSchema.parse(req.body);
        if (!updateData) {
            return res.status(Status.BAD_REQUEST).json({ message: "Invalid update data" });
        }
        const updateMenuItem = await Menu.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-__v');
        if (!updateMenuItem) {
            return res.status(Status.NOT_FOUND).json({ message: "Menu item not found" });
        }
        return res.status(Status.OK).json({ message: "Menu item updated successfully", data: updateMenuItem });
    } catch (err) {
        next(err);
    }
};

const deleteMenuItemService = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(Status.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
        const findAndDelete = await Menu.findByIdAndDelete(id);
        if (!findAndDelete) {
            return res.status(Status.NOT_FOUND).json({ message: "Menu item not found" });
        }
        return res.status(Status.OK).json({ message: "Menu item deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};

export {
    getAllMenuItemsService, getMenuItemByIdService, createMenuItemService, updateMenuItemService, deleteMenuItemService
};