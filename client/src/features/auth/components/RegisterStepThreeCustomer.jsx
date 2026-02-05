import { 
	MapPinIcon, 
	BuildingOfficeIcon, 
	FlagIcon, 
	PhoneIcon,
	UserIcon,
	ChevronLeftIcon,
	HomeIcon
} from "../../../shared/constants/icons.jsx";
import { motion } from "framer-motion";

const RegisterStepThreeCustomer = ({ 
	register, 
	errors, 
	onPrevStep, 
	isRegistering,
	variants 
}) => {
	return (
		<motion.div
			key="step3-customer"
			variants={variants}
			initial="enter"
			animate="center"
			exit="exit"
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			custom={1}
			className="space-y-4 max-w-md mx-auto"
		>
			<div className="grid grid-cols-2 gap-3">
				{/* Address Label */}
				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<HomeIcon className="h-5 w-5" />
						</div>
						<input
							type="text"
							placeholder="Address Label (e.g. Home)"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.label ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("label", {
								required: "Label is required",
							})}
						/>
					</div>
					{errors.label && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.label.message}</p>
					)}
				</div>

				{/* Recipient Name */}
				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<UserIcon className="h-5 w-5" />
						</div>
						<input
							type="text"
							placeholder="Recipient Name"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.recipientName ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("recipientName", {
								required: "Recipient name is required",
							})}
						/>
					</div>
					{errors.recipientName && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.recipientName.message}</p>
					)}
				</div>
			</div>

			{/* Phone */}
			<div>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						<PhoneIcon className="h-5 w-5" />
					</div>
					<input
						type="tel"
						placeholder="Phone Number for Delivery"
						className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
							errors.addressPhone ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("addressPhone", {
							required: "Phone number is required",
						})}
					/>
				</div>
				{errors.addressPhone && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.addressPhone.message}</p>
				)}
			</div>

			{/* Address Line 1 */}
			<div>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						<MapPinIcon className="h-5 w-5" />
					</div>
					<input
						type="text"
						placeholder="Address Line 1"
						className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
							errors.line1 ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("line1", {
							required: "Address line 1 is required",
						})}
					/>
				</div>
				{errors.line1 && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.line1.message}</p>
				)}
			</div>

			{/* City and Postal Code */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<BuildingOfficeIcon className="h-5 w-5" />
						</div>
						<input
							type="text"
							placeholder="City"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.city ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("city", {
								required: "City is required",
							})}
						/>
					</div>
					{errors.city && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.city.message}</p>
					)}
				</div>

				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<MapPinIcon className="h-5 w-5" />
						</div>
						<input
							type="text"
							placeholder="Postal Code"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.postalCode ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("postalCode", {
								required: "Postal code is required",
							})}
						/>
					</div>
					{errors.postalCode && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.postalCode.message}</p>
					)}
				</div>
			</div>

			{/* State and Country */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<BuildingOfficeIcon className="h-5 w-5" />
						</div>
						<input
							type="text"
							placeholder="State"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.state ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("state")}
						/>
					</div>
				</div>

				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<FlagIcon className="h-5 w-5" />
						</div>
						<input
							type="text"
							placeholder="Country"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.country ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("country", {
								required: "Country is required",
							})}
						/>
					</div>
					{errors.country && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.country.message}</p>
					)}
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className="flex gap-4 pt-4">
				<button
					type="button"
					onClick={onPrevStep}
					className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-200 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
				>
					<ChevronLeftIcon className="h-4 w-4 mr-2" />
					Back
				</button>
				<button
					type="submit"
					disabled={isRegistering}
					className="flex-2 flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
				>
					{isRegistering ? (
						<>
							<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Creating Account...
						</>
					) : (
						"Complete Signup"
					)}
				</button>
			</div>
		</motion.div>
	);
};

export default RegisterStepThreeCustomer;
