import { motion } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi2';

const ToastError = ({ errorObj }) => {
	const { title = 'Error', message = 'Something went wrong. Please try again.' } = errorObj || {};

	return (
		<div className="flex items-start gap-3 p-1">
			<div className="flex-shrink-0">
				<HiExclamationCircle className="w-6 h-6 text-red-500" />
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-900">{title}</h3>
				<p className="text-xs text-gray-500 mt-0.5">{message}</p>
			</div>
		</div>
	);
};

export default ToastError;
