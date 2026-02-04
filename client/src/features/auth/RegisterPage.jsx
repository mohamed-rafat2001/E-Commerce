import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useRegister from "./hooks/useRegister.jsx";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
import { motion, AnimatePresence } from "framer-motion";
import { 
	ChevronRightIcon, 
	ChevronLeftIcon,
	MailIcon,
	LockIcon,
	EyeIcon,
	EyeOffIcon,
	UserIcon,
	PhoneIcon,
	GoogleIcon,
	FacebookIcon,
	StoreIcon,
	OrderIcon
} from "../../shared/constants/icons.jsx";

function RegisterPage() {
	const { registerUser, isRegistering } = useRegister();
	const [step, setStep] = useState(1);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		handleSubmit,
		register,
		getValues,
		trigger,
		watch,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			role: "Customer",
			gender: "male"
		}
	});

	// Watch role to style the selected card
	const selectedRole = watch("role");
	const selectedGender = watch("gender");

	async function onNextStep() {
		const fieldsStep1 = ["email", "password", "confirmPassword", "role"];
		const isStep1Valid = await trigger(fieldsStep1);
		if (isStep1Valid) {
			setStep(2);
		}
	}

	function onPrevStep() {
		setStep(1);
	}

	function Submit(data) {
		registerUser(data);
	}

	const variants = {
		enter: (direction) => ({
			x: direction > 0 ? 50 : -50,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction) => ({
			zIndex: 0,
			x: direction < 0 ? 50 : -50,
			opacity: 0,
		}),
	};

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50">
			{/* Left Side - Image */}
			<div className="hidden lg:flex w-1/2 bg-indigo-600 justify-center items-center relative overflow-hidden h-full">
				<div className="absolute inset-0 bg-black opacity-30 z-10"></div>
				<img 
					src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
					alt="E-commerce lifestyle" 
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="relative z-20 text-white p-12 text-center max-w-lg">
					<h1 className="text-4xl font-bold mb-4 tracking-tight">Join Our Community</h1>
					<p className="text-lg text-gray-200 leading-relaxed">Start your journey with us today. Shop the latest trends or sell your own products to millions of users.</p>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex justify-center items-center p-4 sm:p-8 w-full lg:w-1/2 bg-white h-full overflow-y-auto">
				<div className="max-w-md w-full space-y-6 relative pt-4">
					{/* Progress Bar */}
					<div className="absolute -top-4 left-0 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-blue-600"
							initial={{ width: "50%" }}
							animate={{ width: step === 1 ? "50%" : "100%" }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						/>
					</div>

					<div className="text-center lg:text-left">
						<h2 className="mt-2 text-2xl font-extrabold text-gray-900 tracking-tight">
							{step === 1 ? "Create an account" : "Complete your profile"}
						</h2>
						<p className="mt-1 text-sm text-gray-500">
							{step === 1
								? "Enter your details to get started"
								: "Just a few more details about you"}
						</p>
					</div>

					<form onSubmit={handleSubmit(Submit)} className="mt-6 space-y-4">
						<AnimatePresence mode="wait" initial={false} custom={step}>
							{step === 1 && (
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
									{/* Role Selection */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											I want to join as a
										</label>
										<div className="grid grid-cols-2 gap-3">
											<label
												className={`relative flex flex-col items-center justify-center p-3 border-2 rounded-2xl cursor-pointer transition-all hover:border-blue-200 hover:bg-blue-50 ${
													selectedRole === "Customer"
														? "border-blue-600 bg-blue-50 text-blue-700 ring-0"
														: "border-gray-200 text-gray-600"
												}`}
											>
												<input
													type="radio"
													value="Customer"
													className="sr-only"
													{...register("role")}
												/>
												<OrderIcon className={`w-6 h-6 mb-1 ${selectedRole === "Customer" ? "text-blue-600" : "text-gray-400"}`} />
												<span className="font-semibold text-sm">Customer</span>
											</label>
											<label
												className={`relative flex flex-col items-center justify-center p-3 border-2 rounded-2xl cursor-pointer transition-all hover:border-blue-200 hover:bg-blue-50 ${
													selectedRole === "Seller"
														? "border-blue-600 bg-blue-50 text-blue-700 ring-0"
														: "border-gray-200 text-gray-600"
												}`}
											>
												<input
													type="radio"
													value="Seller"
													className="sr-only"
													{...register("role")}
												/>
												<StoreIcon className={`w-6 h-6 mb-1 ${selectedRole === "Seller" ? "text-blue-600" : "text-gray-400"}`} />
												<span className="font-semibold text-sm">Seller</span>
											</label>
										</div>
									</div>

									{/* Email */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
												<MailIcon className="h-5 w-5" />
											</div>
											<input
												type="email"
												placeholder="yourname@example.com"
												className={`appearance-none block w-full pl-10 pr-3 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
													errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300"
												}`}
												{...register("email", {
													required: "Email is required",
													validate: (value) => isEmail(value) || "Invalid email address",
												})}
											/>
										</div>
										{errors.email && (
											<p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
										)}
									</div>

									{/* Password */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Password
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
												<LockIcon className="h-5 w-5" />
											</div>
											<input
												type={showPassword ? "text" : "password"}
												placeholder="Create a strong password"
												className={`appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
													errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-300"
												}`}
												{...register("password", {
													required: "Password is required",
													minLength: 8,
													validate: (value) =>
														isStrongPassword(value) ||
														"Password must be strong (8+ chars, 1 uppercase, 1 number, 1 symbol)",
												})}
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
											>
												{showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
											</button>
										</div>
										{errors.password && (
											<p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
										)}
									</div>

									{/* Confirm Password */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Confirm Password
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
												<LockIcon className="h-5 w-5" />
											</div>
											<input
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm your password"
												className={`appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
													errors.confirmPassword ? "border-red-300 focus:ring-red-500" : "border-gray-300"
												}`}
												{...register("confirmPassword", {
													required: "Please confirm your password",
													validate: (value) =>
														value === getValues("password") || "Passwords do not match",
												})}
											/>
											<button
												type="button"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
											>
												{showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
											</button>
										</div>
										{errors.confirmPassword && (
											<p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
										)}
									</div>

									<button
										type="button"
										onClick={onNextStep}
										className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] mt-4"
									>
										Continue
										<ChevronRightIcon className="w-5 h-5 ml-2" />
									</button>

									<div className="relative mt-4">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-gray-300"></div>
										</div>
										<div className="relative flex justify-center text-sm">
											<span className="px-2 bg-white text-gray-500">Or sign up with</span>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3 mt-4">
										<button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
											<GoogleIcon className="h-5 w-5 mr-2" />
											Google
										</button>
										<button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
											<FacebookIcon className="h-5 w-5 mr-2 text-blue-600" />
											Facebook
										</button>
									</div>
								</motion.div>
							)}

							{step === 2 && (
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
											<label className="block text-sm font-medium text-gray-700 mb-1">
												First Name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
													<UserIcon className="h-5 w-5" />
												</div>
												<input
													type="text"
													placeholder="John"
													className={`appearance-none block w-full pl-10 pr-3 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
														errors.firstName ? "border-red-300" : "border-gray-300"
													}`}
													{...register("firstName", {
														required: "First name is required",
														minLength: { value: 3, message: "Min 3 characters" },
													})}
												/>
											</div>
											{errors.firstName && (
												<p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Last Name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
													<UserIcon className="h-5 w-5" />
												</div>
												<input
													type="text"
													placeholder="Doe"
													className={`appearance-none block w-full pl-10 pr-3 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
														errors.lastName ? "border-red-300" : "border-gray-300"
													}`}
													{...register("lastName", {
														required: "Last name is required",
														minLength: { value: 3, message: "Min 3 characters" },
													})}
												/>
											</div>
											{errors.lastName && (
												<p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
											)}
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone Number
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
												<PhoneIcon className="h-5 w-5" />
											</div>
											<input
												type="tel"
												placeholder="+1 (555) 000-0000"
												className={`appearance-none block w-full pl-10 pr-3 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
													errors.phoneNumber ? "border-red-300" : "border-gray-300"
												}`}
												{...register("phoneNumber", {
													required: "Phone number is required",
													minLength: { value: 3, message: "Min 3 characters" },
												})}
											/>
										</div>
										{errors.phoneNumber && (
											<p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Gender
										</label>
										<div className="flex space-x-4">
											{["male", "female"].map((g) => (
												<label
													key={g}
													className={`flex-1 flex items-center justify-center p-2.5 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
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
													<span className="capitalize font-medium">{g}</span>
												</label>
											))}
										</div>
										{errors.gender && (
											<p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
										)}
									</div>

									<div className="flex gap-3 mt-6">
										<button
											type="button"
											onClick={onPrevStep}
											className="flex-1 flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
										>
											<ChevronLeftIcon className="w-5 h-5 mr-1" />
											Back
										</button>
										<button
											type="submit"
											disabled={isRegistering}
											className="flex-[2] flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isRegistering ? "Creating..." : "Create Account"}
										</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</form>

					<div className="mt-4 text-center text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
						>
							Log in instead
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
