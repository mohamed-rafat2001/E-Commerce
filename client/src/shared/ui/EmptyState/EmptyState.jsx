import React from 'react';
import Button from '../Button/Button.jsx';

const EmptyState = ({ icon, title, message, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="text-gray-300 mb-4 h-12 w-12 flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm">{message}</p>

            {action && (
                <div className="mt-6">
                    <Button variant="primary" onClick={action.onClick}>
                        {action.label}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;
