import { 
	StoreIcon,
	PhoneIcon,
	MailIcon,
	ChevronLeftIcon,
	OrderIcon,
	UserIcon
} from "../../../shared/constants/icons.jsx";
import { motion } from "framer-motion";
import useCategories from "../../category/hooks/useCategories.js";

const RegisterStepThreeSeller = ({ 
	register, 
	errors, 
	onPrevStep, 
	isRegistering,
	variants 
}) => {
	const { categories, isLoading: isLoadingCategories } = useCategories();

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
			{/* Brand Name */}
			<div>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						<StoreIcon className="h-5 w-5" />
					</div>
					<input
						type="text"
						placeholder="Brand Name"
						className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
							errors.brand ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("brand", {
							required: "Brand name is required",
						})}
					/>
				</div>
				{errors.brand && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.brand.message}</p>
				)}
			</div>

			{/* Brand Description */}
			<div>
				<div className="relative">
					<div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none text-gray-400">
						<UserIcon className="h-5 w-5" />
					</div>
					<textarea
						placeholder="Brand Description"
						rows="2"
						className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none ${
							errors.description ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("description", {
							required: "Description is required",
							minLength: { value: 20, message: "Description must be at least 20 characters" }
						})}
					/>
				</div>
				{errors.description && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>
				)}
			</div>

			{/* Business Contact Info */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<MailIcon className="h-5 w-5" />
						</div>
						<input
							type="email"
							placeholder="Business Email"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.businessEmail ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("businessEmail", {
								required: "Required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Invalid email"
								}
							})}
						/>
					</div>
					{errors.businessEmail && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.businessEmail.message}</p>
					)}
				</div>

				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<PhoneIcon className="h-5 w-5" />
						</div>
						<input
							type="tel"
							placeholder="Business Phone"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.businessPhone ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("businessPhone", {
								required: "Required",
							})}
						/>
					</div>
					{errors.businessPhone && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.businessPhone.message}</p>
					)}
				</div>
			</div>

			{/* Primary Category */}
			<div>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						<OrderIcon className="h-5 w-5" />
					</div>
					<select
						className={`appearance-none block w-full pl-11 pr-10 py-3 border rounded-xl shadow-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
							errors.primaryCategory ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("primaryCategory", {
							required: "Primary category is required",
						})}
					>
						<option value="">Select Primary Category</option>
						{isLoadingCategories ? (
							<option disabled>Loading categories...</option>
						) : (
							categories?.map((cat) => (
								<option key={cat._id} value={cat._id}>
									{cat.name}
								</option>
							))
						)}
					</select>
					<div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
				{errors.primaryCategory && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.primaryCategory.message}</p>
				)}
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
