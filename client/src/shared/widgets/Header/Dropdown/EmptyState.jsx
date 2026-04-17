import { SearchIcon } from '../../../constants/icons.jsx';

const EmptyState = ({ message = "No results found" }) => (
    <div className="py-8 text-center">
        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
            <SearchIcon className="w-4 h-4 text-gray-300 dark:text-gray-500" />
        </div>
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500">{message}</p>
    </div>
);

export default EmptyState;
