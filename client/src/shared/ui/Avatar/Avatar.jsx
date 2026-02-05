import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sizes = {
	xs: 'w-6 h-6 text-xs',
	sm: 'w-8 h-8 text-sm',
	md: 'w-12 h-12 text-base',
	lg: 'w-16 h-16 text-xl',
	xl: 'w-20 h-20 text-2xl',
	'2xl': 'w-24 h-24 text-3xl',
};

const statusColors = {
	online: 'bg-emerald-500',
	offline: 'bg-gray-400',
	busy: 'bg-red-500',
	away: 'bg-amber-500',
};

const Avatar = ({
	src,
	alt = 'Avatar',
	name,
	size = 'md',
	className = '',
	status = null,
	ring = false,
	ringColor = 'ring-indigo-500',
	onClick = null,
}) => {
	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		setImageError(false);
	}, [src]);

	const getInitials = (name) => {
		if (!name) return '?';
		const words = name.split(' ');
		if (words.length === 1) return words[0].charAt(0).toUpperCase();
		return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
	};

	const baseClasses =
		'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold';

	const ringClasses = ring ? `ring-4 ${ringColor} ring-offset-2` : '';
	const clickableClasses = onClick ? 'cursor-pointer' : 'cursor-default';

	const showImage = src && !imageError;

	return (
		<motion.div
			className={`${baseClasses} ${sizes[size]} ${ringClasses} ${clickableClasses} ${className}`}
			onClick={onClick}
			whileHover={onClick ? { scale: 1.05 } : {}}
			whileTap={onClick ? { scale: 0.95 } : {}}
		>
			{showImage && (
				<img
					src={src}
					alt={alt}
					className="w-full h-full object-cover"
					onError={() => setImageError(true)}
				/>
			)}
			<span
				className={`absolute inset-0 flex items-center justify-center ${
					showImage ? 'hidden' : 'flex'
				}`}
			>
				{getInitials(name)}
			</span>
			{status && (
				<span
					className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusColors[status]} ring-2 ring-white`}
				></span>
			)}
		</motion.div>
	);
};

const AvatarGroup = ({ children, max = 4, className = '' }) => {
	const childArray = Array.isArray(children) ? children : [children];
	const displayChildren = childArray.slice(0, max);
	const remainingCount = childArray.length - max;

	return (
		<div className={`flex -space-x-3 ${className}`}>
			{displayChildren.map((child, index) => (
				<div
					key={index}
					className="ring-2 ring-white rounded-full"
					style={{ zIndex: displayChildren.length - index }}
				>
					{child}
				</div>
			))}
			{remainingCount > 0 && (
				<div
					className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 ring-2 ring-white"
					style={{ zIndex: 0 }}
				>
					+{remainingCount}
				</div>
			)}
		</div>
	);
};

Avatar.Group = AvatarGroup;

export default Avatar;
