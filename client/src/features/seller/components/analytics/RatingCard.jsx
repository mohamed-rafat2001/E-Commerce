import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const RatingCard = ({ average, count }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.95 }}
		animate={{ opacity: 1, scale: 1 }}
		whileHover={{ y: -4, transition: { duration: 0.2 } }}
		className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-6 text-white shadow-lg shadow-amber-200/50 relative overflow-hidden group"
	>
		<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none group-hover:bg-white/20 transition-colors" />
		
		<div className="flex items-center gap-5 relative z-10">
			<div className="text-5xl font-black tracking-tighter drop-shadow-sm">{average?.toFixed(1) || '0.0'}</div>
			<div>
				<div className="flex gap-1 mb-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<FiStar
							key={star}
							className={`w-5 h-5 ${star <= Math.round(average || 0) ? 'fill-white' : 'stroke-white/50'}`}
						/>
					))}
				</div>
				<p className="text-white/80 text-sm">{count || 0} reviews</p>
			</div>
		</div>
	</motion.div>
);

export default RatingCard;
