import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

const menuItems = [
    // Starters
    { itemName: 'Paneer Tikka', itemPrice: 220, availabilityStatus: true, description: 'Cottage cheese cubes marinated in spices and grilled.' },
    { itemName: 'Gobi Manchurian', itemPrice: 180, availabilityStatus: true, description: 'Deep fried cauliflower florets tossed in spicy sauce.' },
    { itemName: 'Chicken 65', itemPrice: 240, availabilityStatus: true, description: 'Spicy, deep-fried chicken dish.' },
    { itemName: 'Mutton Chukka', itemPrice: 320, availabilityStatus: true, description: 'Spicy dry mutton curry.' },
    { itemName: 'Veg Spring Roll', itemPrice: 150, availabilityStatus: true, description: 'Crispy rolls filled with vegetables.' },
    { itemName: 'Mushroom Pepper Fry', itemPrice: 180, availabilityStatus: true, description: 'Mushrooms sautéed with black pepper and spices.' },
    { itemName: 'Chilli Chicken', itemPrice: 260, availabilityStatus: true, description: 'Spicy Indo-Chinese chicken dish.' },
    { itemName: 'Chilli Paneer', itemPrice: 240, availabilityStatus: true, description: 'Spicy Indo-Chinese paneer dish.' },


    // Mains - Bread
    { itemName: 'Butter Naan', itemPrice: 60, availabilityStatus: true, description: 'Soft fluffy bread cooked in tandoor with butter.' },
    { itemName: 'Garlic Naan', itemPrice: 75, availabilityStatus: true, description: 'Naan topped with minced garlic.' },
    { itemName: 'Tandoori Roti', itemPrice: 45, availabilityStatus: true, description: 'Whole wheat bread cooked in tandoor.' },
    { itemName: 'Kulcha', itemPrice: 55, availabilityStatus: true, description: 'Soft textured bread.' },
    { itemName: 'Lachha Paratha', itemPrice: 70, availabilityStatus: true, description: 'Layered whole wheat flatbread.' },
    { itemName: 'Missi Roti', itemPrice: 65, availabilityStatus: true, description: 'Whole wheat flatbread with chickpea flour.' },

    // Mains - Rice
    { itemName: 'Chicken Biryani', itemPrice: 280, availabilityStatus: true, description: 'Aromatic basmati rice cooked with chicken and spices.' },
    { itemName: 'Mutton Biryani', itemPrice: 350, availabilityStatus: true, description: 'Flavorful rice dish with tender mutton pieces.' },
    { itemName: 'Veg Biryani', itemPrice: 200, availabilityStatus: true, description: 'Rice cooked with mixed vegetables and spices.' },
    { itemName: 'Jeera Rice', itemPrice: 160, availabilityStatus: true, description: 'Basmati rice flavored with cumin seeds.' },
    { itemName: 'Curd Rice', itemPrice: 120, availabilityStatus: true, description: 'Comforting rice mixed with yogurt.' },
    { itemName: 'Lemon Rice', itemPrice: 140, availabilityStatus: true, description: 'Basmati rice flavored with lemon juice and spices.' },
    { itemName: 'Tawa Pulao', itemPrice: 180, availabilityStatus: true, description: 'Rice cooked with vegetables and spices on a flat griddle.' },
    { itemName: 'Peas Pulao', itemPrice: 160, availabilityStatus: true, description: 'Basmati rice cooked with green peas and spices.' },

    // Mains - Gravy
    { itemName: 'Paneer Butter Masala', itemPrice: 260, availabilityStatus: true, description: 'Paneer cubes in a rich tomato-based gravy.' },
    { itemName: 'Chicken Curry', itemPrice: 290, availabilityStatus: true, description: 'Traditional chicken curry.' },
    { itemName: 'Dal Fry', itemPrice: 180, availabilityStatus: true, description: 'Lentils tempered with spices.' },
    { itemName: 'Palak Paneer', itemPrice: 260, availabilityStatus: true, description: 'Paneer cubes in a spinach-based gravy.' },
    { itemName: 'Kadai Paneer', itemPrice: 260, availabilityStatus: true, description: 'Paneer cubes cooked with bell peppers and spices.' },
    { itemName: 'Chana Masala', itemPrice: 200, availabilityStatus: true, description: 'Chickpeas cooked in a spicy tomato-based gravy.' },
    { itemName: 'Rajma Masala', itemPrice: 220, availabilityStatus: true, description: 'Kidney beans cooked in a spicy tomato-based gravy.' },
    { itemName: 'Dal Makhani', itemPrice: 240, availabilityStatus: true, description: 'Black lentils cooked with butter and cream.' },

    // Desserts
    { itemName: 'Gulab Jamun', itemPrice: 80, availabilityStatus: true, description: 'Deep fried milk solids soaked in sugar syrup.' },
    { itemName: 'Rasmalai', itemPrice: 100, availabilityStatus: true, description: 'Soft paneer balls in sweetened milk.' },
    { itemName: 'Gajar ka Halwa', itemPrice: 120, availabilityStatus: true, description: 'Carrot-based sweet pudding.' },
    { itemName: 'Fruit Custard', itemPrice: 100, availabilityStatus: true, description: 'Chilled custard with fresh fruits.' },
    { itemName: 'Ice Cream', itemPrice: 60, availabilityStatus: true, description: 'Scoop of vanilla ice cream.' },

    // Beverages
    { itemName: 'Mango Lassi', itemPrice: 90, availabilityStatus: true, description: 'Yogurt based mango drink.' },
    { itemName: 'Masala Chai', itemPrice: 30, availabilityStatus: true, description: 'Spiced Indian tea.' },
    { itemName: 'Coffee', itemPrice: 40, availabilityStatus: true, description: 'Hot coffee.' },
    { itemName: 'Water Bottle', itemPrice: 20, availabilityStatus: true, description: 'Bottled water.' },
    { itemName: 'Soft Drink', itemPrice: 50, availabilityStatus: true, description: 'Canned soft drink.' }
];

const seedMenu = async () => {
    await connectDB();

    try {
        // Option 1: Clear existing menu (Uncomment if you want to wipe clean)
        // await Menu.deleteMany({});
        // console.log('Existing menu cleared');

        // Option 2: Add only if not exists (To avoid duplicates on multiple runs)
        for (const item of menuItems) {
            const exists = await Menu.findOne({ itemName: item.itemName });
            if (!exists) {
                await Menu.create(item);
                console.log(`Added: ${item.itemName}`);
            } else {
                console.log(`Skipped (Exists): ${item.itemName}`);
            }
        }

        console.log('Menu seeding completed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedMenu();
