import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const RatingCard = ({ average, count }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.9 }}
		animate={{ opacity: 1, scale: 1 }}
		className="bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white"
	>
		<div className="flex items-center gap-4">
			<div className="text-5xl font-black">{average?.toFixed(1) || '0.0'}</div>
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
