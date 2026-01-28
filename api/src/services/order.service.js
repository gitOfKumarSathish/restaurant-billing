import Order from "../models/order.js";
import { createOrderSchema } from "../validators/orderValidator.js";
import Menu from './../models/menu.js';

const getOrdersService = async (req, res, next) => {
    try {
        const orderItems = createOrderSchema.parse(req.body);
        if (!orderItems) {
            return res.status(400).json({ message: "Invalid order data" });
        }
        // console.log({ first: orderItems });
        const enrichedItems = await Promise.all(orderItems.items.map(async (item) => {
            let eachTotal = await Menu.findById(item.id).then(menuItem => {
                if (!menuItem) {
                    throw new Error(`Menu item with ID ${item.id} not found`);
                }
                return {
                    id: item.id,
                    orderId: item.id,
                    itemName: menuItem.itemName,
                    quantity: item.quantity,
                    price: menuItem.itemPrice,
                    total: menuItem.itemPrice * item.quantity,
                };
            }).catch(err => {
                next(err);
            });
            return ({ ...item, ...eachTotal });
        }));
        // // console.log({ enrichedItems });
        const totalPrice = enrichedItems.reduce((acc, item) => acc + item.total, 0);
        const grandTotal = orderItems.discounts?.available ? totalPrice - (totalPrice * (orderItems.discounts.percentage / 100)) : totalPrice;
        const finalOrder = {
            orderId: new Date().getTime().toString(),
            items: enrichedItems,
            totalPrice,
            grandTotal: grandTotal,
            discounts: orderItems.discounts
        };
        await Order.create(finalOrder);
        return res.status(200).json({ message: "Orders received successfully", data: finalOrder });
    }
    catch (err) {
        next(err);
    }
};

export {
    getOrdersService
};