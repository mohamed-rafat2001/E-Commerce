import mongoose from 'mongoose';
mongoose.connect('mongodb://127.0.0.1:27017/E-Commerce').then(async () => {
    const user = await mongoose.connection.db.collection('usermodels').findOne({});
    if(!user) { console.log('no user'); process.exit(0); }
    console.log('Test User:', user.email);

    // check wishlist
    const wl = await mongoose.connection.db.collection('wishlistmodels').findOne({ userId: user._id });
    console.log('Wishlist doc in DB:', wl);
    
    process.exit(0);
});
