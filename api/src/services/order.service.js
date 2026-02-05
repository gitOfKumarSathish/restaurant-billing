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

const getOrderByIdService = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log({ id });
        const orderCheck = await Order.aggregate([
            {
                $match: {
                    orderId: id,
                }
            },
            // {
            //     $project: {
            //         orderId: 1,
            //         items: 1,
            //         discounts: 1,
            //         totalPrice: 1,
            //         grandTotal: 1
            //     }
            // }
        ]);
        console.log({ orderCheck });
        // const order = await Order.findById(id);
        if (!orderCheck || orderCheck.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({ message: "Order fetched successfully", data: orderCheck[0] });
    }
    catch (err) {
        next(err);
    }
};
const getDashboardStatsService = async (req, res, next) => {
    try {
        const { date } = req.query;
        let matchStage = {};

        if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            matchStage = {
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            };
        }

        // 1. General Stats (Revenue, Count, Discounts)
        const generalStats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$grandTotal" },
                    totalBasePrice: { $sum: "$totalPrice" }
                }
            }
        ]);

        const stats = generalStats[0] || { totalOrders: 0, totalRevenue: 0, totalBasePrice: 0 };
        const totalDiscountGiven = stats.totalBasePrice - stats.totalRevenue;
        const averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

        // 2. Top Selling Items
        const topSellingItems = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.itemName",
                    itemName: { $first: "$items.itemName" },
                    quantity: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.total" }
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, itemName: 1, quantity: 1, revenue: 1 } }
        ]);

        // 3. Peak Hours
        const peakHours = await Order.aggregate([
            { $match: matchStage },
            {
                $project: {
                    hour: { $hour: "$createdAt" } // Extract hour (0-23)
                }
            },
            {
                $group: {
                    _id: "$hour",
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { orderCount: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    hour: {
                        $concat: [
                            { $toString: "$_id" },
                            ":00"
                        ]
                    },
                    orderCount: 1
                }
            }
        ]);

        const responseData = {
            date: date || "All Time",
            totalOrders: stats.totalOrders,
            totalRevenue: stats.totalRevenue,
            averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
            totalDiscountGiven: parseFloat(totalDiscountGiven.toFixed(2)),
            topSellingItems,
            peakHours
        };

        return res.status(200).json({ message: "Stats fetched successfully", data: responseData });

    } catch (err) {
        next(err);
    }
};

const getStatusService = async (req, res, next) => {
    try {
        const { date } = req.query; // e.g. "2026-02-05"
        let matchStage = {};

        if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            matchStage = {
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            };
        }

        // 1. General Stats (Revenue, Count, Discounts)
        const generalStats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$grandTotal" }, // Actually paid
                    totalBasePrice: { $sum: "$totalPrice" }, // Before discount
                    averageOrderValue: { $avg: "$grandTotal" },
                }
            }
        ]);

        const stats = generalStats[0] || { totalOrders: 0, totalRevenue: 0, totalBasePrice: 0 };
        const totalDiscountGiven = stats.totalBasePrice - stats.totalRevenue;
        // const averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

        // 2. Top Selling Items
        const topSellingItems = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.itemName",
                    itemName: { $first: "$items.itemName" },
                    quantity: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.total" }
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, itemName: 1, quantity: 1, revenue: 1 } }
        ]);

        // 3. Peak Hours
        const peakHours = await Order.aggregate([
            { $match: matchStage },
            {
                $project: {
                    hour: { $hour: "$createdAt" } // Extract hour (0-23)
                }
            },
            {
                $group: {
                    _id: "$hour",
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { orderCount: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    hour: {
                        $concat: [
                            { $toString: "$_id" },
                            ":00"
                        ]
                    },
                    orderCount: 1
                }
            }
        ]);

        const responseData = {
            date: date || "All Time",
            totalOrders: stats.totalOrders,
            totalRevenue: stats.totalRevenue,
            averageOrderValue: stats.averageOrderValue,
            totalDiscountGiven: parseFloat(totalDiscountGiven.toFixed(2)),
            topSellingItems,
            peakHours
        };

        return res.status(200).json({ message: "Stats fetched successfully", data: responseData });

    } catch (err) {
        console.log({ err });
        next(err);
    }
};

const getAllOrdersService = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json({ message: "Orders fetched successfully", data: orders });
    } catch (err) {
        console.log({ err });
        next(err);
    }
};

export {
    getOrdersService,
    getOrderByIdService,
    getDashboardStatsService,
    getStatusService,
    getAllOrdersService
};  