import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi2';

const ToastSuccess = ({ successObj }) => {
	const { title = 'Success', message = 'Action completed successfully' } = successObj || {};

	return (
		<div className="flex items-center gap-4 py-1 pr-2">
			<div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
				<HiCheckCircle className="w-6 h-6 text-emerald-500" />
			</div>
			<div className="flex flex-col">
				<h3 className="text-sm font-bold text-gray-900 tracking-tight leading-none mb-1">{title}</h3>
				<p className="text-[11px] font-medium text-gray-400 leading-tight uppercase tracking-wider">{message}</p>
			</div>
		</div>
	);
};

export default ToastSuccess;
