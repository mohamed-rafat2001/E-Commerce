import { motion } from "motion/react";
function LoadingSpinner() {
	return (
		<div className="flex justify-center items-center space-x-1 h-screen w-screen ">
			<motion.div
				className="w-16 h-16 border-blue-500 border-6 border-r-amber-50   rounded-full"
				animate={{
					rotate: 360,
				}}
				transition={{
					duration: 0.6,
					repeat: Infinity,
					ease: "linear",
				}}
			/>
		</div>
	);
}
export default LoadingSpinner;
