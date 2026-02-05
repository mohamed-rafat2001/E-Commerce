import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../../../shared/ui/index.js';
import { Header } from '../../../shared/widgets/Header/index.js';

const featuredProducts = [
	{ id: 1, name: 'Wireless Headphones', price: '$299', image: '🎧', category: 'Electronics', rating: 4.8 },
	{ id: 2, name: 'Smart Watch Pro', price: '$399', image: '⌚', category: 'Wearables', rating: 4.9 },
	{ id: 3, name: 'Laptop Stand', price: '$79', image: '💻', category: 'Accessories', rating: 4.7 },
	{ id: 4, name: 'Mechanical Keyboard', price: '$159', image: '⌨️', category: 'Electronics', rating: 4.6 },
];

const categories = [
	{ name: 'Electronics', icon: '📱', count: '2,453' },
	{ name: 'Fashion', icon: '👕', count: '5,821' },
	{ name: 'Home & Garden', icon: '🏡', count: '1,234' },
	{ name: 'Sports', icon: '⚽', count: '987' },
	{ name: 'Beauty', icon: '💄', count: '2,156' },
	{ name: 'Books', icon: '📚', count: '3,478' },
];

const HomePage = () => {
	return (
		<div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
			{/* Header */}
			<Header />

			{/* Hero Section */}
			<section className="relative overflow-hidden">
				{/* Background decorations */}
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute top-20 right-0 w-96 h-96 rounded-full 
						bg-linear-to-br from-indigo-400/20 to-purple-500/20 blur-3xl" />
					<div className="absolute bottom-0 left-0 w-80 h-80 rounded-full 
						bg-linear-to-br from-cyan-400/20 to-blue-500/20 blur-3xl" />
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
					<div className="text-center max-w-4xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<Badge variant="gradient" size="lg" className="mb-6">
								✨ New Arrivals Every Week
							</Badge>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
								Discover Amazing
								<span className="block bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 
									bg-clip-text text-transparent">
									Products Online
								</span>
							</h1>
							<p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
								Shop from thousands of products from trusted sellers worldwide.
								Quality guaranteed with fast delivery to your doorstep.
							</p>
							<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
								<Button variant="primary" size="lg">
									Start Shopping
								</Button>
								<Button variant="secondary" size="lg">
									Browse Categories
								</Button>
							</div>
						</motion.div>

						{/* Stats */}
						<motion.div
							className="grid grid-cols-3 gap-8 mt-16"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.6 }}
						>
							{[
								{ value: '50K+', label: 'Products' },
								{ value: '15K+', label: 'Sellers' },
								{ value: '100K+', label: 'Happy Customers' },
							].map((stat) => (
								<div key={stat.label}>
									<p className="text-3xl sm:text-4xl font-bold text-gray-900">
										{stat.value}
									</p>
									<p className="text-gray-500 mt-1">{stat.label}</p>
								</div>
							))}
						</motion.div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
							Shop by Category
						</h2>
						<p className="text-gray-500 max-w-2xl mx-auto">
							Explore our wide range of categories and find exactly what you're looking for.
						</p>
					</motion.div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{categories.map((category, index) => (
							<motion.div
								key={category.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.05 }}
							>
								<Link
									to="/"
									className="block p-6 bg-gray-50 rounded-2xl text-center 
										hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 group"
								>
									<span className="text-4xl mb-3 block 
										group-hover:scale-110 transition-transform">
										{category.icon}
									</span>
									<h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
										{category.name}
									</h3>
									<p className="text-sm text-gray-500">{category.count} items</p>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="flex items-center justify-between mb-12"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
					>
						<div>
							<h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
								Featured Products
							</h2>
							<p className="text-gray-500 mt-2">
								Handpicked products just for you
							</p>
						</div>
						<Button variant="outline" size="md">
							View All
						</Button>
					</motion.div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{featuredProducts.map((product, index) => (
							<motion.div
								key={product.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
							>
								<Card variant="elevated" className="group cursor-pointer">
									<div className="aspect-square bg-gray-100 rounded-xl mb-4 
										flex items-center justify-center text-6xl 
										group-hover:scale-105 transition-transform duration-300">
										{product.image}
									</div>
									<div className="flex items-start justify-between">
										<div>
											<Badge variant="secondary" size="sm" className="mb-2">
												{product.category}
											</Badge>
											<h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
												{product.name}
											</h3>
											<div className="flex items-center gap-1 mt-1">
												<span className="text-yellow-500">★</span>
												<span className="text-sm text-gray-600">{product.rating}</span>
											</div>
										</div>
										<p className="text-lg font-bold text-indigo-600">{product.price}</p>
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white text-center"
						style={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						}}
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
					>
						{/* Decorative elements */}
						<div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full 
							-translate-y-1/2 translate-x-1/2" />
						<div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full 
							translate-y-1/2" />

						<div className="relative z-10 max-w-2xl mx-auto">
							<h2 className="text-3xl sm:text-4xl font-bold mb-4">
								Ready to Start Selling?
							</h2>
							<p className="text-white/80 mb-8 text-lg">
								Join thousands of sellers and reach millions of customers worldwide.
								Start your journey today!
							</p>
							<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
								<Link to="/register">
									<Button
										variant="secondary"
										size="lg"
										className="bg-white! text-indigo-600! hover:bg-gray-100!"
									>
										Become a Seller
									</Button>
								</Link>
								<Link to="/login">
									<Button
										variant="ghost"
										size="lg"
										className="text-white! border border-white/30 hover:bg-white/10!"
									>
										Sign In
									</Button>
								</Link>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div className="col-span-2 md:col-span-1">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 
									flex items-center justify-center font-bold text-xl">
									E
								</div>
								<span className="text-xl font-bold">E-Commerce</span>
							</div>
							<p className="text-gray-400 text-sm">
								Your one-stop shop for all your needs. Quality products, trusted sellers,
								fast delivery.
							</p>
						</div>
						{[
							{
								title: 'Shop',
								links: ['All Products', 'Categories', 'New Arrivals', 'Best Sellers'],
							},
							{
								title: 'Support',
								links: ['Help Center', 'Contact Us', 'Returns', 'FAQ'],
							},
							{
								title: 'Company',
								links: ['About Us', 'Careers', 'Press', 'Blog'],
							},
						].map((section) => (
							<div key={section.title}>
								<h4 className="font-semibold mb-4">{section.title}</h4>
								<ul className="space-y-2">
									{section.links.map((link) => (
										<li key={link}>
											<Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
												{link}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
						<p>© 2026 E-Commerce. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default HomePage;
