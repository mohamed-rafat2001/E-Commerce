import mongoose from 'mongoose';
import WishListModel from './models/WishListModel.js';
import UserModel from './models/UserModel.js';
import jwt from 'jsonwebtoken';

const connectDB = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/E-Commerce');
    const user = await UserModel.findOne({});
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    console.log("Found user:", user.email);
    
    // Call the wishlist API using native fetch
    try {
        const response = await fetch('http://127.0.0.1:4000/api/v1/wishlist/user', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));
    } catch(e) {
        console.error("API Error:", e.message);
    }
    
    process.exit(0);
};

connectDB();
