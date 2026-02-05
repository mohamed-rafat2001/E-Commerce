import { motion } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi2';

const ToastError = ({ errorObj }) => {
	const { title = 'Error', message = 'Something went wrong. Please try again.' } = errorObj || {};

	return (
		<div className="flex items-center gap-4 py-1 pr-2">
			<div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 shadow-sm shadow-red-500/5">
				<HiExclamationCircle className="w-6 h-6 text-red-500" />
			</div>
			<div className="flex flex-col">
				<h3 className="text-sm font-bold text-gray-900 tracking-tight leading-none mb-1">{title}</h3>
				<p className="text-[11px] font-medium text-gray-400 leading-tight uppercase tracking-wider">{message}</p>
			</div>
		</div>
	);
};

export default ToastError;
