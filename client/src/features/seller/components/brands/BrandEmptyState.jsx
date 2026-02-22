import { Button } from '../../../../shared/ui/index.js';
import { FiPlus, FiImage } from 'react-icons/fi';

const BrandEmptyState = ({ onCreate }) => (
	<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
		<FiImage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
		<h3 className="text-xl font-bold text-gray-900 mb-2">No brands yet</h3>
		<p className="text-gray-500 mb-6">Create your first brand to get started</p>
		<Button 
			onClick={onCreate}
			icon={<FiPlus className="w-4 h-4" />}
		>
			Create Your First Brand
		</Button>
	</div>
);

export default BrandEmptyState;
