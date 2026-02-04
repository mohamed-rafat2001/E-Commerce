import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../../../shared/ui/index.js';
import { HeartIcon } from '../../../shared/constants/icons.jsx';

const WishlistPreview = ({ items }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<Card variant="elevated" className="h-full">
				<Card.Header>
					<div className="flex items-center justify-between">
						<Card.Title>My Wishlist</Card.Title>
						<HeartIcon className="w-5 h-5 text-rose-500" />
					</div>
				</Card.Header>
				<Card.Content className="space-y-3">
					{items.map((item, index) => (
						<motion.div
							key={item.id}
							className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 
								hover:border-rose-200 hover:shadow-sm transition-all"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 + index * 0.05 }}
						>
							<span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
								{item.image}
							</span>
							<div className="flex-1 min-w-0">
								<p className="font-medium text-gray-900 truncate">{item.name}</p>
								<div className="flex items-center gap-2">
									<span className="font-bold text-gray-900">{item.price}</span>
									{item.discount && (
										<Badge variant="danger" size="sm">
											{item.discount}
										</Badge>
									)}
								</div>
							</div>
						</motion.div>
					))}
					<Button variant="outline" fullWidth className="mt-4">
						View All Wishlist
					</Button>
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default WishlistPreview;
