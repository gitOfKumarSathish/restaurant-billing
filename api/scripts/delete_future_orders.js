const mongoose = require('mongoose');
const Order = require('../src/models/order');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'restaurant_billing' });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

const fixOrders = async () => {
    await connectDB();
    const now = new Date();
    console.log(`Deleting orders created after: ${now.toISOString()}`);

    // Delete orders with createdAt > now
    const result = await Order.deleteMany({ createdAt: { $gt: now } });
    console.log(`Deleted ${result.deletedCount} future orders.`);

    process.exit();
};

fixOrders();
