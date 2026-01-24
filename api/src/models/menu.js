import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    itemPrice: {
        type: number,
        required: true
    },
    availabilityStatus: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;