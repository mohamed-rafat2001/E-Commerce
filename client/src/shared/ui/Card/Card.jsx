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
			className={`bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-slate-200/40 dark:shadow-black/20 overflow-hidden transition-colors ${hoverStyles} ${className}`}>
			<div className={paddingClass}>
				{children}
			</div>
		</div>
	);
};

export const Header = ({ children, className = "" }) => (
	<div className={`px-6 py-5 border-b border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/20 flex items-center justify-between ${className}`}>
		{children}
	</div>
);

export const Title = ({ children, className = "" }) => (
	<h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 font-display ${className}`}>
		{children}
	</h3>
);

export const Content = ({ children, className = "", padding = "p-6" }) => (
	<div className={`${padding} ${className}`}>
		{children}
	</div>
);

export const Footer = ({ children, className = "" }) => (
	<div className={`px-6 py-4 bg-gray-50/30 dark:bg-gray-900/20 ${className}`}>
		{children}
	</div>
);

Card.Header = Header;
Card.Title = Title;
Card.Content = Content;
Card.Footer = Footer;

export default Card;
