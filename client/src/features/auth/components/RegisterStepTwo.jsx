import { 
	UserIcon, 
	PhoneIcon,
	ChevronLeftIcon,
	ChevronRightIcon
} from "../../../shared/constants/icons.jsx";
import { motion } from "framer-motion";

const RegisterStepTwo = ({ 
	register, 
	errors, 
	selectedGender, 
	onPrevStep, 
	isRegistering,
	variants,
	onNextStep,
	showNextButton
}) => {
	return (
		<motion.div
			key="step2"
			variants={variants}
			initial="enter"
			animate="center"
			exit="exit"
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			custom={-1}
			className="space-y-4"
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<UserIcon className="h-5 w-5" />
						</div>
						<input
							type="text"
							placeholder="First Name"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.firstName ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("firstName", {
								required: "Required",
								minLength: { value: 3, message: "Min 3 chars" },
							})}
						/>
					</div>
					{errors.firstName && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.firstName.message}</p>
					)}
				</div>
				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
							<UserIcon className="h-5 w-5" />
						</div>
						<input
							type="text"
							placeholder="Last Name"
							className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
								errors.lastName ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
							}`}
							{...register("lastName", {
								required: "Required",
								minLength: { value: 3, message: "Min 3 chars" },
							})}
						/>
					</div>
					{errors.lastName && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.lastName.message}</p>
					)}
				</div>
			</div>

			<div>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						<PhoneIcon className="h-5 w-5" />
					</div>
					<input
						type="tel"
						placeholder="Phone Number"
						className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
							errors.phoneNumber ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("phoneNumber", {
							required: "Required",
							minLength: { value: 3, message: "Min 3 chars" },
						})}
					/>
				</div>
				{errors.phoneNumber && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.phoneNumber.message}</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2 ml-1">
					Gender
				</label>
				<div className="flex space-x-3">
					{["male", "female", "other"].map((g) => (
						<label
							key={g}
							className={`flex-1 flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all hover:bg-blue-50 ${
								selectedGender === g
									? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
									: "border-gray-200 text-gray-600"
							}`}
						>
							<input
								type="radio"
								value={g}
								className="sr-only"
								{...register("gender", { required: "Gender is required" })}
							/>
							<span className="capitalize font-medium text-sm">{g}</span>
						</label>
					))}
				</div>
				{errors.gender && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.gender.message}</p>
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
				{showNextButton && (
					<button
						type="button"
						onClick={onNextStep}
						className="flex-2 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 cursor-pointer"
					>
						Next Step
						<ChevronRightIcon className="w-5 h-5 ml-1" />
					</button>
				)}
				{!showNextButton && (
					<button
						type="submit"
						disabled={isRegistering}
						className="flex-2 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						{isRegistering ? "Creating..." : "Complete Registration"}
					</button>
				)}
			</div>
		</motion.div>
	);
};

export default RegisterStepTwo;
