import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import useOrderHistory from '../../customer/hooks/useOrderHistory.js';
import OrderListCard from '../components/OrderListCard.jsx';
import { Button, EmptyState, Skeleton, Pagination } from '../../../shared/ui/index.js';

const TABS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const ITEMS_PER_PAGE = 8;

/**
 * Public Orders List Page (/orders)
 * Customer-facing card layout with filter tabs
 */
const OrdersPage = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get('status') || 'All';
	const page = parseInt(searchParams.get('page')) || 1;

	const { orders, totalPages, isLoading } = useOrderHistory({
		status: activeTab === 'All' ? undefined : activeTab.toLowerCase(),
		page,
		limit: ITEMS_PER_PAGE,
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleTabChange = (tab) => {
		const newParams = new URLSearchParams(searchParams);
		if (tab === 'All') newParams.delete('status');
		else newParams.set('status', tab);
		newParams.set('page', '1');
		setSearchParams(newParams);
	};

	const handlePageChange = (newPage) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('page', newPage.toString());
		setSearchParams(newParams);
	};

	return (
		<div className="min-h-screen bg-gray-50 font-sans">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
				{/* Back */}
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					className="mb-6"
				>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate('/')}
						className="gap-2 text-gray-500 hover:text-gray-900"
					>
						<FiArrowLeft className="w-4 h-4" /> Home
					</Button>
				</motion.div>

				{/* Header */}
				<motion.header
					className="mb-8"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">My Orders</h1>
					<p className="text-gray-500 font-medium">Track and manage your recent purchases.</p>
				</motion.header>

				{/* Filter Tabs */}
				<motion.div
					className="flex gap-2 p-1.5 bg-gray-100 w-fit rounded-2xl overflow-x-auto mb-8"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					{TABS.map((tab) => (
						<button
							key={tab}
							onClick={() => handleTabChange(tab)}
							className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap
								${activeTab === tab
									? 'bg-white text-indigo-600 shadow-sm'
									: 'text-gray-500 hover:text-gray-700'
								}`}
						>
							{tab}
						</button>
					))}
				</motion.div>

				{/* Content */}
				{isLoading ? (
					<div className="space-y-4">
						<Skeleton variant="image" className="h-28 rounded-2xl" count={3} />
					</div>
				) : orders.length > 0 ? (
					<>
						<div className="space-y-4">
							<AnimatePresence mode="popLayout">
								{orders.map((order, index) => (
									<OrderListCard key={order._id} order={order} index={index} />
								))}
							</AnimatePresence>
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-8 flex justify-center">
								<Pagination
									totalPages={totalPages}
									currentPage={page}
									onPageChange={handlePageChange}
								/>
							</div>
						)}
					</>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="py-12"
					>
						<EmptyState
							icon={<FiShoppingBag className="w-12 h-12" />}
							title="No orders found"
							message={
								activeTab === 'All'
									? "You haven't placed any orders yet. Start shopping to see your orders here."
									: `No orders with "${activeTab}" status.`
							}
							action={{
								label: 'Browse Products',
								onClick: () => navigate('/products'),
							}}
						/>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default OrdersPage;
