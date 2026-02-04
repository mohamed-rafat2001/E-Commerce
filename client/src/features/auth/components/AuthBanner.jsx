import { motion } from "framer-motion";

const AuthBanner = ({ image, title, subtitle, accentColor = "blue" }) => {
	const accentColors = {
		blue: "bg-blue-500 text-blue-400",
		indigo: "bg-indigo-500 text-indigo-400",
	};

	const [bgClass, textClass] = accentColors[accentColor].split(" ");

	return (
		<div className="hidden lg:flex w-1/2 h-full items-center justify-center">
			<div className="relative w-full h-full overflow-hidden">
				<div className={`absolute inset-0 ${accentColor === 'blue' ? 'bg-blue-900/20' : 'bg-indigo-900/20'} z-10 mix-blend-multiply`}></div>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
				<img 
					src={image} 
					alt="Auth Banner" 
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="relative z-20 h-full flex flex-col justify-end p-16 text-white">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.8 }}
					>
						<div className={`w-12 h-1 ${bgClass} mb-6 rounded-full`}></div>
						<h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
							{title}
						</h1>
						<p className="text-lg text-gray-200 leading-relaxed max-w-md opacity-90 font-medium">
							{subtitle}
						</p>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default AuthBanner;
