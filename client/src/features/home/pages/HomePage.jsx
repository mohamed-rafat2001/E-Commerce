import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Card, Badge, Input } from '../../../shared/ui/index.js';
import { Header } from '../../../shared/widgets/Header/index.js';
import {
	FiSearch,
	FiShoppingBag,
	FiTrendingUp,
	FiShield,
	FiTruck,
	FiUsers,
	FiPieChart,
	FiArrowRight
} from 'react-icons/fi';

const featuredProducts = [
	{
		id: 1,
		name: 'Elite Wireless Headphones',
		price: '$299',
		image: '/images/headphones.png',
		category: 'Electronics',
		rating: 4.8,
		reviews: '1.2k'
	},
	{
		id: 2,
		name: 'Smart Watch Pro Max',
		price: '$399',
		image: '/images/smart-watch.png',
		category: 'Wearables',
		rating: 4.9,
		reviews: '850'
	},
	{
		id: 3,
		name: 'Ergonomic Laptop Stand',
		price: '$79',
		image: '/images/laptop-stand.png',
		category: 'Accessories',
		rating: 4.7,
		reviews: '2.4k'
	},
	{
		id: 4,
		name: 'Mechanical RGB Keyboard',
		price: '$159',
		image: '/images/keyboard.png',
		category: 'Electronics',
		rating: 4.6,
		reviews: '530'
	},
];

const categories = [
	{ name: 'Electronics', icon: '📱', count: '2,453', color: 'bg-blue-50' },
	{ name: 'Fashion', icon: '👕', count: '5,821', color: 'bg-pink-50' },
	{ name: 'Home & Garden', icon: '🏡', count: '1,234', color: 'bg-green-50' },
	{ name: 'Sports', icon: '⚽', count: '987', color: 'bg-orange-50' },
	{ name: 'Beauty', icon: '💄', count: '2,156', color: 'bg-purple-50' },
	{ name: 'Books', icon: '📚', count: '3,478', color: 'bg-yellow-50' },
];

const features = [
	{
		title: 'For Shoppers',
		description: 'Discover curated collections, personalized recommendations, and secure checkout with multiple payment options.',
		icon: <FiShoppingBag className="w-6 h-6" />,
		color: 'indigo',
		links: [
			{ label: 'Smart Filtering', icon: <FiSearch /> },
			{ label: 'Wishlist Sync', icon: <FiShield /> },
			{ label: 'Order Tracking', icon: <FiTruck /> }
		]
	},
	{
		title: 'For Sellers',
		description: 'Scale your business with powerful inventory management, real-time analytics, and global logistics support.',
		icon: <FiTrendingUp className="w-6 h-6" />,
		color: 'purple',
		links: [
			{ label: 'Advanced Analytics', icon: <FiPieChart /> },
			{ label: 'Brand Management', icon: <FiTrendingUp /> },
			{ label: 'Bulk Operations', icon: <FiUsers /> }
		]
	},
	{
		title: 'For Enterprise',
		description: 'Complete control over your marketplace with role-based access, automated moderation, and deep insights.',
		icon: <FiShield className="w-6 h-6" />,
		color: 'pink',
		links: [
			{ label: 'Role Management', icon: <FiUsers /> },
			{ label: 'Revenue Insights', icon: <FiPieChart /> },
			{ label: 'Global Moderation', icon: <FiShield /> }
		]
	}
];

const HomePage = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			{/* Hero Section */}
			<section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
				{/* Background Image with Overlay */}
				<div
					className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
					style={{
						backgroundImage: 'url("/images/hero.png")',
					}}
				>
					<div className="absolute inset-0 bg-linear-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
					<div className="max-w-3xl">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Badge variant="gradient" size="lg" className="mb-6 float-animation">
								🚀 Redefining the Future of E-Commerce
							</Badge>
							<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
								The Most Advanced
								<span className="block italic text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
									Marketplace Engine
								</span>
							</h1>
							<p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
								A comprehensive ecosystem built for the next generation of online commerce.
								Powerful tools for shoppers, sellers, and administrators.
							</p>

							{/* Hero Actions */}
							<div className="flex flex-col sm:flex-row gap-4 mb-12">
								<div className="relative group flex-1 max-w-md">
									<FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
									<input
										placeholder="Search for premium products..."
										className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 outline-hidden focus:ring-2 focus:ring-indigo-500/50 transition-all"
									/>
								</div>
								<Button variant="premium" size="lg" className="animated-gradient text-white border-0">
									Explore Now
								</Button>
							</div>

							{/* Trust Badges */}
							<div className="flex flex-wrap items-center gap-8 text-gray-400">
								<div className="flex items-center gap-2">
									<FiShield className="text-indigo-400" />
									<span className="text-sm font-medium">Verified Sellers</span>
								</div>
								<div className="flex items-center gap-2">
									<FiTruck className="text-indigo-400" />
									<span className="text-sm font-medium">Global Delivery</span>
								</div>
								<div className="flex items-center gap-2">
									<FiPieChart className="text-indigo-400" />
									<span className="text-sm font-medium">Secure Payments</span>
								</div>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Floating Element */}
				<motion.div
					className="absolute right-[5%] bottom-[10%] hidden lg:block"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.5, duration: 1 }}
				>
					<div className="glass-card p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white">
								<FiTrendingUp size={24} />
							</div>
							<div>
								<p className="text-xs text-gray-500">Global Sales</p>
								<p className="text-lg font-bold text-gray-900">+124.5%</p>
							</div>
						</div>
						<div className="space-y-2">
							<div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
								<div className="h-full bg-indigo-500 w-[70%]" />
							</div>
							<div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
								<div className="h-full bg-purple-500 w-[45%]" />
							</div>
						</div>
					</div>
				</motion.div>
			</section>

			{/* Role Highlights Section */}
			<section className="py-24 relative overflow-hidden bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="text-center mb-16">
						<Badge variant="secondary" className="mb-4">Ecosystem</Badge>
						<h2 className="text-4xl font-black text-gray-900 mb-4">Built for Everyone</h2>
						<p className="text-gray-500 max-w-2xl mx-auto text-lg">
							Whether you\'re browsing, building a brand, or managing the platform,
							we provide the tools you need to succeed.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((feature, idx) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: idx * 0.1 }}
							>
								<Card variant="elevated" className="h-full p-8 group hover:border-indigo-500 transition-colors duration-300">
									<div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
										{feature.icon}
									</div>
									<h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
									<p className="text-gray-500 mb-8 leading-relaxed">
										{feature.description}
									</p>
									<div className="space-y-3">
										{feature.links.map((link, lIdx) => (
											<div key={lIdx} className="flex items-center gap-3 text-sm font-medium text-gray-600">
												<span className={`text-${feature.color}-500`}>{link.icon}</span>
												{link.label}
											</div>
										))}
									</div>
									<button className="mt-10 flex items-center gap-2 text-indigo-600 font-bold group/btn">
										Learn More <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
									</button>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Categories Grid */}
			<section className="py-24 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-end justify-between mb-12">
						<div>
							<h2 className="text-4xl font-black text-gray-900 mb-4">Curated Categories</h2>
							<p className="text-gray-500">Find exactly what you\'re looking for in our specialized collections.</p>
						</div>
						<Button variant="outline" className="hidden sm:flex items-center gap-2">
							View Catalog <FiArrowRight />
						</Button>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
						{categories.map((cat, idx) => (
							<motion.div
								key={cat.name}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: idx * 0.05 }}
								whileHover={{ y: -5 }}
							>
								<Link to="/" className={`block p-8 rounded-3xl ${cat.color} text-center transition-all duration-300 hover:shadow-xl hover:bg-white border border-transparent hover:border-indigo-100 group`}>
									<span className="text-5xl mb-4 block group-hover:scale-110 transition-transform duration-300">
										{cat.icon}
									</span>
									<p className="font-bold text-gray-900 mb-1">{cat.name}</p>
									<p className="text-xs text-gray-500 font-medium">{cat.count} Items</p>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-24 bg-white relative">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<Badge variant="primary" className="mb-4">Handpicked</Badge>
						<h2 className="text-4xl font-black text-gray-900 mb-4">Popular This Week</h2>
						<p className="text-gray-500">Discover the most trending items in our global marketplace.</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{featuredProducts.map((product, idx) => (
							<motion.div
								key={product.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: idx * 0.1 }}
							>
								<Card variant="elevated" className="overflow-hidden group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
									<div className="relative aspect-[4/5] overflow-hidden">
										<img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute top-4 left-4">
											<Badge variant="secondary" className="backdrop-blur-md bg-white/70 text-indigo-600 border-0">
												{product.category}
											</Badge>
										</div>
										<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
											<Button className="w-full bg-white text-gray-900 hover:bg-indigo-50 border-0 font-bold py-3 flex items-center justify-center gap-2">
												<FiShoppingBag /> Quick Add
											</Button>
										</div>
									</div>
									<div className="p-6">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-1 text-sm font-bold text-amber-500">
												★ {product.rating} <span className="text-gray-400 font-normal">({product.reviews})</span>
											</div>
											<span className="text-xl font-black text-indigo-600">{product.price}</span>
										</div>
										<h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
											{product.name}
										</h3>
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Premium Stats Section */}
			<section className="py-24 bg-gray-900 text-white relative overflow-hidden">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -mr-64 -mt-64" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full -ml-64 -mb-64" />

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
						{[
							{ label: 'Active Shoppers', value: '2.5M+', icon: <FiUsers /> },
							{ label: 'Verified Sellers', value: '45K+', icon: <FiCheckSquare /> },
							{ label: 'Global Orders', value: '12M+', icon: <FiShoppingBag /> },
							{ label: 'Security Score', value: '99.9%', icon: <FiShield /> },
						].map((stat, idx) => (
							<motion.div
								key={idx}
								initial={{ opacity: 0, scale: 0.5 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: idx * 0.1 }}
							>
								<div className="text-indigo-400 mb-4 flex justify-center text-3xl">
									{stat.icon}
								</div>
								<h4 className="text-4xl lg:text-5xl font-black mb-2">{stat.value}</h4>
								<p className="text-gray-400 font-medium">{stat.label}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Modern CTA */}
			<section className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="relative rounded-[3rem] overflow-hidden p-12 sm:p-20 text-center"
						style={{
							background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
						}}
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
					>
						<div className="absolute inset-0 bg-[url(\'https://www.transparenttextures.com/patterns/cubes.png\')] opacity-10" />
						<div className="relative z-10 max-w-2xl mx-auto">
							<h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
								Start Your Commerce Journey
							</h2>
							<p className="text-indigo-100 text-lg mb-12 leading-relaxed">
								Join a community of forward-thinking entrepreneurs and global shoppers.
								The platform designed to move at the speed of your ideas.
							</p>
							<div className="flex flex-col sm:flex-row items-center justify-center gap-6">
								<Link to="/register">
									<Button
										variant="primary"
										size="lg"
										className="bg-white! text-indigo-600! font-black px-10 py-5 rounded-2xl hover:bg-gray-100! shadow-2xl transition-all"
									>
										Get Started Now
									</Button>
								</Link>
								<Link to="/login">
									<button className="text-white font-bold flex items-center gap-2 hover:underline decoration-2 underline-offset-8">
										Sign In to Account <FiArrowRight />
									</button>
								</Link>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
						<div className="col-span-2">
							<div className="flex items-center gap-3 mb-8">
								<div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 
									flex items-center justify-center font-bold text-2xl text-white shadow-lg">
									E
								</div>
								<span className="text-2xl font-black text-gray-900 tracking-tight">E-Commerce</span>
							</div>
							<p className="text-gray-500 text-lg leading-relaxed max-w-sm">
								Defining the next era of global trade through innovation, accessibility, and trust.
							</p>
							<div className="flex gap-4 mt-8">
								{/* Social Icons Placeholder */}
								{[1, 2, 3, 4].map(i => (
									<div key={i} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:shadow-md transition-all cursor-pointer border border-gray-100" />
								))}
							</div>
						</div>

						{[
							{
								title: 'Marketplace',
								links: ['All Products', 'Seller Central', 'Customer Stories', 'Global Logistics'],
							},
							{
								title: 'Resources',
								links: ['Merchant API', 'Help Center', 'Safety Center', 'Brand Guidelines'],
							},
							{
								title: 'Legals',
								links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility'],
							},
						].map((section) => (
							<div key={section.title}>
								<h4 className="font-black text-gray-900 mb-6 uppercase tracking-wider text-sm">{section.title}</h4>
								<ul className="space-y-4">
									{section.links.map((link) => (
										<li key={link}>
											<Link to="/" className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">
												{link}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-sm font-medium">
						<p>© 2026 E-Commerce Platforms Inc. All rights reserved.</p>
						<div className="flex gap-8">
							<span className="hover:text-gray-600 cursor-pointer">System Status</span>
							<span className="hover:text-gray-600 cursor-pointer">Feedback</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

// Mock missing icon
const FiCheckSquare = () => (
	<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
);

export default HomePage;
