import React from 'react';

const paddings = {
	sm: "p-3",
	md: "p-4 md:p-6",
	lg: "p-6 md:p-8"
};

const Card = ({
	padding = "md",
	hoverable = false,
	className = "",
	children,
	onClick
}) => {
	const hoverStyles = hoverable ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" : "";

	// Safely determine padding class
	const paddingClass = paddings[padding] || (padding === "none" ? "" : padding);

	return (
		<div
			onClick={onClick}
			className={`bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden ${hoverStyles} ${className}`}>
			<div className={paddingClass}>
				{children}
			</div>
		</div>
	);
};

export const Header = ({ children, className = "" }) => (
	<div className={`px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between ${className}`}>
		{children}
	</div>
);

export const Title = ({ children, className = "" }) => (
	<h3 className={`text-xl font-bold text-gray-900 font-display ${className}`}>
		{children}
	</h3>
);

export const Content = ({ children, className = "", padding = "p-6" }) => (
	<div className={`${padding} ${className}`}>
		{children}
	</div>
);

Card.Header = Header;
Card.Title = Title;
Card.Content = Content;

export default Card;
