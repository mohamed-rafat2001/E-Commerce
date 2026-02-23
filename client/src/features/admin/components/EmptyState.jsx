import { Button } from '../../../shared/ui/index.js';

const EmptyState = ({ icon, title, subtitle, searchQuery, onClear }) => {
	const Icon = icon;
	return (
	<div className="text-center py-16">
		<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
			<Icon className="w-10 h-10 text-gray-300" />
		</div>
		<h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
		<p className="text-gray-500 text-sm max-w-sm mx-auto">{subtitle}</p>
		{searchQuery && onClear && (
			<Button variant="ghost" className="mt-4" onClick={onClear}>
				Clear Search
			</Button>
		)}
	</div>
);
};

export default EmptyState;
