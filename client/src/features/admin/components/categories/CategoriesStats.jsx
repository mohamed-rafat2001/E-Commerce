import { CategoryIcon, TagIcon } from '../../../../shared/constants/icons.jsx';
import AdminStatCard from '../AdminStatCard.jsx';

const CategoriesStats = ({ stats }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
			<AdminStatCard 
				label="Total Categories" 
				value={stats.categories.total} 
				icon={CategoryIcon} 
				color="bg-gray-900" 
			/>
			<AdminStatCard 
				label="Total Subcategories" 
				value={stats.subCategories.total} 
				icon={TagIcon} 
				color="bg-indigo-600" 
			/>
		</div>
	);
};

export default CategoriesStats;
