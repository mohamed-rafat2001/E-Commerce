const SaleProgressBar = ({ sold, total }) => {
    const safeSold = Number.isFinite(sold) ? sold : 0;
    const safeTotal = Number.isFinite(total) && total > 0 ? total : safeSold;
    const percentage = safeTotal > 0 ? Math.min(Math.round((safeSold / safeTotal) * 100), 100) : 0;
    const available = Math.max(safeTotal - safeSold, 0);

    return (
        <div className="space-y-2 mt-4">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                <span className={`${percentage >= 80 ? 'text-red-500' : 'text-gray-400'}`}>
                    Available: <span className="text-gray-900">{available}</span>
                </span>
                <span className="text-indigo-600">Sold: {percentage}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${percentage >= 85 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default SaleProgressBar;
