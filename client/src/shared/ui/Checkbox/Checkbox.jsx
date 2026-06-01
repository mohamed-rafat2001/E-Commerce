import React from 'react';

const Checkbox = ({ label, checked, onChange, disabled = false, className = "", ...props }) => {
	return (
		<label className={`flex items-center gap-3 cursor-pointer group ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}>
			<div className="relative">
				<input
					type="checkbox"
					checked={checked}
					onChange={onChange}
					disabled={disabled}
					className="peer sr-only"
					{...props}
				/>
				<div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200 group-hover:border-indigo-400 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 flex items-center justify-center">
					<svg
						className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="4"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>
			</div>
			{label && (
				<span className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
					{label}
				</span>
			)}
		</label>
	);
};

export default Checkbox;
