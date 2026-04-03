import React from 'react';

const PageHeader = ({
    title,
    subtitle,
    breadcrumbs,
    actions,
    className = ""
}) => {
    return (
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-6 ${className}`}>
            <div className="flex-1">
                {breadcrumbs && (
                    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <span className={`${idx === breadcrumbs.length - 1 ? 'text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md' : 'hover:text-gray-900 transition-colors cursor-pointer'}`}>
                                    {crumb.label}
                                </span>
                                {idx < breadcrumbs.length - 1 && <span className="opacity-40">/</span>}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 font-display leading-[1.1] tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-base md:text-lg text-gray-500 mt-2 font-medium max-w-2xl leading-relaxed">{subtitle}</p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3 self-start md:self-end">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
