import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OrderModel from './models/OrderModel.js';

dotenv.config({ path: '.env' });

mongoose.connect(process.env.DB_URL).then(async () => {
    const orders = await OrderModel.find({orderNumber: "ORD-20260425-12LA78"});
    console.log(orders.map(o => ({id: o.orderNumber, total: o.totalPrice, req: o.itemsPrice, discountAmount: o.discountAmount, shippingPrice: o.shippingPrice, shippingDiscountAmount: o.shippingDiscountAmount})));
    process.exit(0);
});

