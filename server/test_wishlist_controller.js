import mongoose from 'mongoose';
import WishListModel from './models/WishListModel.js';
import { getOneByOwner } from './controllers/handlerFactory.js';
import { CACHE_CONFIG } from './utils/cache.js'; 

const connectDB = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/E-Commerce');
    const user = { _id: new mongoose.Types.ObjectId('69a94b44c334d07f73c2b741') };
    
    // Simulate req, res, next
    const req = { 
        user, 
        params: { id: "user" } // this simulates /api/v1/wishlist/user if they put :id ? No, router.get("/user") has no id!
    };
    
    // Test what happens if params has NO id
    const reqNoParam = {
        user,
        params: {}
    };

    const res = {
        status: (code) => { console.log('Status:', code); return res; },
        json: (data) => { console.log('JSON Output:', JSON.stringify(data, null, 2)); }
    };
    
    const next = (err) => console.error('Next called with:', err);
    
    console.log("--- Testing with req.params.id = 'user' (simulating /api/v1/wishlist/:id with id=user) ---");
    const getOne = getOneByOwner(WishListModel);
    await getOne(req, res, next);
    
    console.log("\n--- Testing with NO req.params.id (simulating router.get('/user')) ---");
    await getOne(reqNoParam, res, next);

    process.exit(0);
};

connectDB();
