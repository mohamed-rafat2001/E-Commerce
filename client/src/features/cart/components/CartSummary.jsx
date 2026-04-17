import { Card, Badge, Button } from '../../../shared/ui';
import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal, shipping, total, onCheckout }) => (
    <div className="lg:col-span-1">
        <Card padding="lg" className="sticky top-24 border-indigo-100 shadow-indigo-100/30">
            <h3 className="text-2xl font-black text-gray-900 mb-8 font-display">Order Summary</h3>
            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                    <span>Shipping</span>
                    {shipping === 0 ? <Badge variant="success">Free</Badge> : <span className="text-gray-900">${shipping.toFixed(2)}</span>}
                </div>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-6 mb-10">
                <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-bold">Estimated Total</span>
                    <span className="text-4xl font-black text-indigo-600 font-display">${total.toFixed(2)}</span>
                </div>
            </div>
            <div className="space-y-4">
                <Button fullWidth size="lg" className="font-black text-lg shadow-indigo-200 shadow-2xl" onClick={onCheckout}>
                    Proceed to Checkout
                </Button>
                <Link to="/" className="block">
                    <Button variant="primary" fullWidth size="lg" className="">Keep Shopping</Button>
                </Link>
            </div>
        </Card>
    </div>
);

export default CartSummary;
