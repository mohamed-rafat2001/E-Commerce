import { Select } from '../../../../shared/ui/index.js';
import { SearchIcon } from '../../../../shared/constants/icons.jsx';

const CategoriesFilter = ({ searchQuery, setSearchQuery, limit, setLimit }) => {
	return (
		<div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
			<div className="relative flex-1 w-full">
				<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
				<input
					type="text"
					placeholder="Search categories..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
				/>
			</div>
			<Select 
				containerClassName="min-w-[170px] w-full md:w-auto"
				label="Items per page"
				value={limit}
				onChange={setLimit}
				options={[
					{ value: 5, label: '5 items' },
					{ value: 10, label: '10 items' },
					{ value: 20, label: '20 items' },
					{ value: 50, label: '50 items' },
				]}
			/>
		</div>
	);
};

export default CategoriesFilter;
