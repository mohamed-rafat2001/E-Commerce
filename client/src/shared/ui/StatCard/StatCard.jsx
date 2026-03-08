import React from 'react';

const colors = {
    primary: "bg-indigo-50 text-indigo-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
    error: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600",
};

const StatCard = ({ title, value, change, icon, color = "primary", className = "" }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    return (
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
                    {icon}
                </div>
                {change !== undefined && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : isNegative ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {isPositive ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 font-display mt-1">{value}</h4>
            </div>
        </div>
    );
};

export default StatCard;
