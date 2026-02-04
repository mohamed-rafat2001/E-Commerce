import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi2';

const ToastSuccess = ({ successObj }) => {
	const { title = 'Success', message = 'Action completed successfully' } = successObj || {};

	return (
		<div className="flex items-start gap-3 p-1">
			<div className="flex-shrink-0">
				<HiCheckCircle className="w-6 h-6 text-emerald-500" />
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-900">{title}</h3>
				<p className="text-xs text-gray-500 mt-0.5">{message}</p>
			</div>
		</div>
	);
};

export default ToastSuccess;
