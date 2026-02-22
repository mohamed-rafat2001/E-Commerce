import { Button } from '../../../../shared/ui/index.js';
import { PlusIcon } from '../../../../shared/constants/icons.jsx';

const CategoriesHeader = ({ handleCreateCategory }) => {
	return (
		<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Categories & Subcategories</h1>
				<p className="text-gray-500 mt-1">Manage product classification hierarchy</p>
			</div>
			<div className="flex gap-3">
				<Button onClick={handleCreateCategory} icon={<PlusIcon />}>
					Add Category
				</Button>
			</div>
		</div>
	);
};

export default CategoriesHeader;
