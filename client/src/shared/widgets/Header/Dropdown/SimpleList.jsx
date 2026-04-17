import { Link } from 'react-router-dom';
import { memo } from 'react';
import EmptyState from './EmptyState.jsx';

/**
 * SimpleList - Refactored display for basic dropdown lists
 */
const SimpleList = memo(({ filteredItems, resolveItemPath, closeMenu, isSimple, hasManyItems }) => {
    if (filteredItems.length === 0) return <EmptyState />;
    
    return (
        <div className={`grid gap-2 ${isSimple ? 'grid-cols-1' : hasManyItems ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {filteredItems.map((item) => (
                <Link
                    key={item.id || item._id || item.name}
                    to={resolveItemPath(item)}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group border border-transparent hover:border-gray-100 dark:hover:border-gray-700 ${isSimple ? 'p-2' : 'p-2.5'}`}
                    role="menuitem"
                >
                    {item.icon && (
                        <span className="text-base group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                        </span>
                    )}
                    <div className="flex flex-col">
                        <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 font-bold transition-colors text-xs">
                            {item.name}
                        </span>
                        {!isSimple && item.description && (
                            <span className="text-[10px] text-gray-400 font-medium line-clamp-1 group-hover:text-gray-500 transition-colors">
                                {item.description}
                            </span>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
});

export default SimpleList;
