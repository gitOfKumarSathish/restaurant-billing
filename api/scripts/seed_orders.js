import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../src/models/order.js';
import Menu from '../src/models/menu.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant-billing', {
            dbName: 'restaurant_billing'
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seedOrders = async () => {
    await connectDB();

    try {
        const menuItems = await Menu.find({});
        if (menuItems.length === 0) {
            console.error('No menu items found! Run seed_menu.js first.');
            process.exit(1);
        }

        const ordersToCreate = [];
        const today = new Date();
        // Reset to start of today locally for cleaner logic, though we'll randomise the time
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 205; i++) {
            // 1. Random Items
            const numberOfItems = getRandomInt(1, 4); // 1 to 4 items per order
            const orderItems = [];
            let currentOrderTotal = 0;

            for (let j = 0; j < numberOfItems; j++) {
                const randomMenuIndex = getRandomInt(0, menuItems.length - 1);
                const menuItem = menuItems[randomMenuIndex];
                const quantity = getRandomInt(1, 3);
                const total = menuItem.itemPrice * quantity;

                orderItems.push({
                    id: menuItem._id.toString(),
                    itemName: menuItem.itemName,
                    quantity: quantity,
                    price: menuItem.itemPrice,
                    total: total
                });
                currentOrderTotal += total;
            }

            // 2. Random Time (Weighted for Lunch 12-3 PM and Dinner 7-10 PM)
            const orderDate = new Date(today); // Clone today
            const rand = Math.random();
            let hour;
            if (rand < 0.4) {
                // 40% chance: Lunch (12 PM - 3 PM)
                hour = getRandomInt(12, 14);
            } else if (rand < 0.8) {
                // 40% chance: Dinner (7 PM - 10 PM)
                hour = getRandomInt(19, 21);
            } else {
                // 20% chance: Other times (11 AM - 10 PM)
                hour = getRandomInt(11, 22);
            }
            orderDate.setHours(hour, getRandomInt(0, 59), getRandomInt(0, 59));

            // 3. Random Discount
            let discount = 0;
            let discountPercentage = 0;
            let discountsObj = { available: false, percentage: 0 };

            if (Math.random() < 0.2) { // 20% chance of discount
                const discountOptions = [5, 10, 15];
                discountPercentage = discountOptions[getRandomInt(0, 2)];
                discount = (currentOrderTotal * discountPercentage) / 100;
                discountsObj = {
                    available: true,
                    percentage: discountPercentage
                };
            }

            const grandTotal = currentOrderTotal - discount;

            // 4. Create Order Object
            ordersToCreate.push({
                orderId: Date.now().toString() + getRandomInt(100, 999) + i, // Unique ID
                items: orderItems,
                discounts: discountsObj,
                totalPrice: currentOrderTotal,
                grandTotal: Math.round(grandTotal), // Round off for cleaner usage
                createdAt: orderDate,
                updatedAt: orderDate
            });
        }

        // Insert in batches
        await Order.insertMany(ordersToCreate);
        console.log(`Successfully seeded ${ordersToCreate.length} orders for ${today.toLocaleDateString()}`);

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedOrders();
