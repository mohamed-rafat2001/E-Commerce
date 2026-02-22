import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const AlertsBanner = ({ alerts }) => {
	if (!alerts || alerts.length === 0) return null;

	return (
		<div className="space-y-3">
			{alerts.map((alert, i) => (
				<motion.div
					key={i}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: i * 0.1 }}
					className={`flex items-start gap-3 p-4 rounded-2xl border ${
						alert.type === 'warning' 
							? 'bg-amber-50 border-amber-200 text-amber-800' 
							: alert.type === 'error'
								? 'bg-rose-50 border-rose-200 text-rose-800'
								: 'bg-blue-50 border-blue-200 text-blue-800'
					}`}
				>
					<div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
						alert.type === 'warning' 
							? 'bg-amber-100 text-amber-600' 
							: alert.type === 'error'
								? 'bg-rose-100 text-rose-600'
								: 'bg-blue-100 text-blue-600'
					}`}>
						<FiAlertTriangle className="w-4 h-4" />
					</div>
					<div className="flex-1">
						<span className="text-sm font-semibold">{alert.title || 'Alert'}</span>
						<p className="text-sm mt-1">{alert.message}</p>
						{alert.action && (
							<Link 
								to={alert.action.to}
								className={`inline-block mt-2 text-sm font-medium ${
									alert.type === 'warning' 
										? 'text-amber-700 hover:text-amber-800' 
										: alert.type === 'error'
											? 'text-rose-700 hover:text-rose-800'
											: 'text-blue-700 hover:text-blue-800'
								}`}
							>
								{alert.action.label} →
							</Link>
						)}
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default AlertsBanner;
