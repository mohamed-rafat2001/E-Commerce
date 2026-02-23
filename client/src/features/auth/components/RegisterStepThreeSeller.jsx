import { 
	StoreIcon,
	ChevronLeftIcon,
	OrderIcon,
} from "../../../shared/constants/icons.jsx";
import { motion } from "framer-motion";
import useCategories from "../../admin/hooks/categories/useCategories.js";

const RegisterStepThreeSeller = ({ 
	register, 
	onPrevStep, 
	isRegistering,
	variants,
	watch
}) => {
	const { categories, isLoading: isLoadingCategories } = useCategories();
	const selectedCategories = watch("preferredCategories") || [];
	
	const toggleCategory = (categoryId) => {
		const currentCategories = selectedCategories || [];
		const newCategories = currentCategories.includes(categoryId)
			? currentCategories.filter(id => id !== categoryId)
			: [...currentCategories, categoryId];
			
		// Update the form value
		register("preferredCategories").onChange({
			target: { name: "preferredCategories", value: newCategories }
		});
	};

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
			<div className="text-center py-4">
				<StoreIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
				<h3 className="text-xl font-bold text-gray-900 mb-2">Preferred Categories</h3>
				<p className="text-gray-600 text-sm">
					Select the categories you're interested in selling
				</p>
			</div>

			{/* Category Selection */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-3">
					Select Preferred Categories
				</label>
				
				{isLoadingCategories ? (
					<div className="text-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-2 text-gray-500">Loading categories...</p>
					</div>
				) : (
					<div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
						{categories?.map((category) => (
							<label
								key={category._id}
								className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all hover:bg-blue-50 ${
									selectedCategories.includes(category._id)
										? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
										: "border-gray-200 hover:border-blue-300"
								}`}
							>
								<input
									type="checkbox"
									value={category._id}
									checked={selectedCategories.includes(category._id)}
									onChange={() => toggleCategory(category._id)}
									className="sr-only"
								/>
								<div className="flex items-center">
									<div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${
										selectedCategories.includes(category._id)
											? "bg-blue-500 border-blue-500"
											: "border-gray-300"
									}`}>
										{selectedCategories.includes(category._id) && (
											<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
											</svg>
										)}
									</div>
									<span className="text-sm font-medium text-gray-700">{category.name}</span>
								</div>
							</label>
						))}
					</div>
				)}
				
				{selectedCategories.length > 0 && (
					<p className="mt-2 text-xs text-gray-500">
						{selectedCategories.length} category{selectedCategories.length !== 1 ? 's' : ''} selected
					</p>
				)}
			</div>

			<div className="text-center py-4">
				<p className="text-gray-600 text-sm">
					You can update your preferred categories later in your seller dashboard
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