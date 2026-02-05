import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/ui/index.js';

const WelcomeBanner = ({ title, subtitle }) => {
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative overflow-hidden rounded-3xl p-8 text-white"
			style={{
				background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
			}}
		>
			{/* Decorative shapes */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
			<div className="absolute bottom-0 left-20 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" />

			<div className="relative z-10">
				<h1 className="text-3xl font-bold mb-2">{title}</h1>
				<p className="text-white/80 max-w-xl">
					{subtitle}
				</p>
				<div className="flex flex-wrap gap-4 mt-6">
					<Button 
						variant="secondary" 
						size="md"
						onClick={() => navigate('/')}
					>
						Start Shopping
					</Button>
					<Button
						variant="ghost"
						size="md"
						className="text-white border border-white/30 hover:bg-white/10"
						onClick={() => navigate('../orderHistory')}
					>
						View Deals
					</Button>
				</div>
			</div>
		</motion.div>
	);
};

export default WelcomeBanner;
