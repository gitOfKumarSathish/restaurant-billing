import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true, index: true },
    items: [{
        id: String,
        quantity: Number,
        itemName: String,
        price: Number,
        total: Number,
        _id: false
    }],
    discounts: {
        available: Boolean,
        percentage: Number
    },
    totalPrice: Number,
    grandTotal: Number
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.orderId = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

//