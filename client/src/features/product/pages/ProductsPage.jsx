import { DataHeader } from '../../../shared/ui/index.js';
import { FiPackage } from 'react-icons/fi';

const ProductsPage = () => {
	return (
		<div className="space-y-6 pb-10">
			<DataHeader 
				title="Products"
				description="Browse all products"
				searchPlaceholder="Search products..."
				sortOptions={[
					{ label: 'Newest First', value: '-createdAt' },
					{ label: 'Oldest First', value: 'createdAt' },
					{ label: 'Price: Low to High', value: 'price.amount' },
					{ label: 'Price: High to Low', value: '-price.amount' },
					{ label: 'Name (A-Z)', value: 'name' },
					{ label: 'Name (Z-A)', value: '-name' }
				]}
				actions={null}
			/>
			
			<div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
				<div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<FiPackage className="w-10 h-10 text-indigo-500" />
				</div>
				<h3 className="text-xl font-bold text-gray-900 mb-2">Products page coming soon</h3>
				<p className="text-gray-500 max-w-sm mx-auto">
					This public products page is not implemented yet. The placeholder exists to satisfy routing and exports.
				</p>
			</div>
		</div>
	);
};

export default ProductsPage;

