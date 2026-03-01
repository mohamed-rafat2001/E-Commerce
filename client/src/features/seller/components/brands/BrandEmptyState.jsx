import { Button } from '../../../../shared/ui/index.js';
import { FiPlus, FiTag } from 'react-icons/fi';

const BrandEmptyState = ({ onCreate }) => (
	<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
		<div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
			<FiTag className="w-10 h-10 text-indigo-500" />
		</div>
		<h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No brands found</h3>
		<p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Create your first brand to start organizing your products under unique identities</p>
		<Button 
			onClick={onCreate}
			icon={<FiPlus className="w-4 h-4" />}
			className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200/50 hover:-translate-y-0.5"
		>
			Create Your First Brand
		</Button>
	</div>
);

export default BrandEmptyState;
