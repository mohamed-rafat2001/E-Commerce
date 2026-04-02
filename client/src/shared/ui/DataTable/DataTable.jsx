import React from 'react';
import LoadingSpinner from '../LoadingSpinner.jsx';
import EmptyState from '../EmptyState/EmptyState.jsx';
import Pagination from '../Pagination/Pagination.jsx';

const DataTable = ({ columns, data, isLoading, emptyMessage, totalPages, onPageChange, currentPage }) => {
    if (isLoading) {
        return (
            <div className="w-full bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <div className="p-8 flex justify-center items-center scale-75">
                    <LoadingSpinner size="lg" message="Loading data..." />
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                <EmptyState
                    title="No Data Found"
                    message={emptyMessage || "There is nothing to display here yet."}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={col.key || idx} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    {col.header || col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={row._id || row.id || rowIndex} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors duration-150">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-4 py-3 text-gray-700">
                                        {col.render ? col.render(row, rowIndex) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center py-2">
                    <Pagination
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        currentPage={currentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default DataTable;
