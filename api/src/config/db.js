import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const URI = process.env.MONGO_URI;
        if (!URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(URI, {
            dbName: "restaurant_billing"
        });
        console.log(`✅ Connected to MongoDB Database: "${mongoose.connection.name}"`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;