import { 
	MailIcon, 
	LockIcon, 
	EyeIcon, 
	EyeOffIcon, 
	ChevronRightIcon
} from "../../../shared/constants/icons.jsx";
import SocialLogin from "./SocialLogin.jsx";
import isEmail from "validator/lib/isEmail";
import { isStrongPassword } from "validator";
import { motion } from "framer-motion";

const RegisterStepOne = ({ 
	register, 
	errors, 
	showPassword, 
	setShowPassword, 
	showConfirmPassword, 
	onNextStep, 
	getValues,
	variants 
}) => {
	return (
		<motion.div
			key="step1"
			variants={variants}
			initial="enter"
			animate="center"
			exit="exit"
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			custom={1}
			className="space-y-4"
		>

			{/* Email */}
			<div>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						<MailIcon className="h-5 w-5" />
					</div>
					<input
						type="email"
						placeholder="Email address"
						className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
							errors.email ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("email", {
							required: "Email is required",
							validate: (value) => isEmail(value) || "Invalid email",
						})}
					/>
				</div>
				{errors.email && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
				)}
			</div>

			{/* Password */}
			<div>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						<LockIcon className="h-5 w-5" />
					</div>
					<input
						type={showPassword ? "text" : "password"}
						placeholder="Password"
						className={`appearance-none block w-full pl-11 pr-11 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
							errors.password ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("password", {
							required: "Password is required",
							minLength: 8,
							validate: (value) =>
								isStrongPassword(value) ||
								"Weak password",
						})}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute inset-y-0 right-0 pr-3 flex items-center p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
					>
						{showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
					</button>
				</div>
				{errors.password && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
				)}
			</div>

			{/* Confirm Password */}
			<div>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						<LockIcon className="h-5 w-5" />
					</div>
					<input
						type={showConfirmPassword ? "text" : "password"}
						placeholder="Confirm Password"
						className={`appearance-none block w-full pl-11 pr-11 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
							errors.confirmPassword ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
						}`}
						{...register("confirmPassword", {
							required: "Required",
							validate: (value) =>
								value === getValues("password") || "No match",
						})}
					/>
				</div>
				{errors.confirmPassword && (
					<p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
				)}
			</div>

			<div className="pt-2">
				<button
					type="button"
					onClick={onNextStep}
					className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 cursor-pointer"
				>
					Next Step
					<ChevronRightIcon className="ml-2 h-4 w-4" />
				</button>
			</div>

			<SocialLogin />
		</motion.div>
	);
};

export default RegisterStepOne;
