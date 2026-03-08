import React from 'react';

const PageHeader = ({
    title,
    subtitle,
    breadcrumbs,
    actions,
    className = ""
}) => {
    return (
        <div className={`flex flex-col md:flex-row md:items-start justify-between mb-6 md:mb-8 gap-4 ${className}`}>
            <div>
                {breadcrumbs && (
                    <div className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <span className={idx === breadcrumbs.length - 1 ? 'text-gray-900' : ''}>
                                    {crumb.label}
                                </span>
                                {idx < breadcrumbs.length - 1 && <span>/</span>}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3 self-start">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
