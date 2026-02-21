import { 
	StoreIcon,
	ChevronLeftIcon,
} from "../../../shared/constants/icons.jsx";
import { motion } from "framer-motion";

const RegisterStepThreeSeller = ({ 
	register, 
	errors, 
	onPrevStep, 
	isRegistering,
	variants 
}) => {
	return (
		<motion.div
			key="step3-seller"
			variants={variants}
			initial="enter"
			animate="center"
			exit="exit"
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			custom={-1}
			className="space-y-4 max-w-md mx-auto"
		>
			<div className="text-center py-8">
				<StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
				<h3 className="text-xl font-bold text-gray-900 mb-2">Seller Account Created!</h3>
				<p className="text-gray-600">
					You can add your brand information later from your seller dashboard
				</p>
			</div>

			<div className="flex gap-3 mt-6">
				<button
					type="button"
					onClick={onPrevStep}
					className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
				>
					<ChevronLeftIcon className="w-5 h-5 mr-1" />
					Back
				</button>
				<button
					type="submit"
					disabled={isRegistering}
					className="flex-2 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					{isRegistering ? "Creating..." : "Complete Registration"}
				</button>
			</div>
		</motion.div>
	);
};

export default RegisterStepThreeSeller;
