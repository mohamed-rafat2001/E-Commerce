import mongoose from 'mongoose';
import * as cartService from './services/cartService.js';
import CartModel from './models/CartModel.js';

mongoose.connect('mongodb://127.0.0.1:27017/E-Commerce').then(async () => {
    const user = { _id: new mongoose.Types.ObjectId('69a94b44c334d07f73c2b741') };
    const guestItems = [{ product_id: '69a966b0be56816d9d47ff36', quantity: 2 }];
    
    console.log("Before merge cart:");
    let c = await CartModel.findOne({ userId: user._id, active: true });
    console.log(JSON.stringify(c, null, 2));
    
    console.log("\nMerging...");
    try {
        const result = await cartService.mergeGuestCart(user._id, guestItems);
        console.log("\nMerge result:", JSON.stringify(result, null, 2));
    } catch(e) { console.error("Error", e); }
    
    process.exit(0);
});
