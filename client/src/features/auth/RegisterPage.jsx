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
			<div className="hidden lg:flex w-1/2 h-full items-center justify-center">
				<div className="relative w-full h-full overflow-hidden">
					<div className="absolute inset-0 bg-indigo-900/20 z-10 mix-blend-multiply"></div>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
					<img 
						src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
						alt="E-commerce lifestyle" 
						className="absolute inset-0 w-full h-full object-cover"
					/>
					<div className="relative z-20 h-full flex flex-col justify-end p-16 text-white">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							<div className="w-12 h-1 bg-indigo-500 mb-6 rounded-full"></div>
							<h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
								Start Your <br />
								<span className="text-indigo-400">Next Chapter.</span>
							</h1>
							<p className="text-lg text-gray-200 leading-relaxed max-w-md opacity-90 font-medium">
								Join millions of users. Shop the latest trends or start selling your own products today.
							</p>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex justify-center items-center p-4 w-full lg:w-1/2 h-full overflow-y-auto">
				<motion.div 
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-md w-full bg-white shadow-[0_24px_60px_rgba(15,_23,_42,_0.35)] rounded-[2rem] p-8 space-y-5 ring-1 ring-gray-100/50 relative overflow-hidden"
				>
					{/* Progress Bar */}
					<div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
						<motion.div
							className="h-full bg-blue-600"
							initial={{ width: "50%" }}
							animate={{ width: step === 1 ? "50%" : "100%" }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						/>
					</div>

					<div className="text-center pt-2">
						<h2 className="text-2xl font-bold text-gray-900 tracking-tight">
							{step === 1 ? "Create account" : "Your profile"}
						</h2>
						<p className="mt-2 text-sm text-gray-500">
							{step === 1
								? "Enter your details to get started"
								: "Just a few more details"}
						</p>
					</div>

					<form onSubmit={handleSubmit(Submit)} className="mt-6 space-y-5">
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
										<div className="grid grid-cols-2 gap-3">
											<label
												className={`relative flex flex-row items-center justify-center p-3 border rounded-xl cursor-pointer transition-all hover:bg-blue-50 ${
													selectedRole === "Customer"
														? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
														: "border-gray-200 text-gray-600"
												}`}
											>
												<input
													type="radio"
													value="Customer"
													className="sr-only"
													{...register("role")}
												/>
												<OrderIcon className={`w-5 h-5 mr-2 ${selectedRole === "Customer" ? "text-blue-600" : "text-gray-400"}`} />
												<span className="font-medium text-sm">Customer</span>
											</label>
											<label
												className={`relative flex flex-row items-center justify-center p-3 border rounded-xl cursor-pointer transition-all hover:bg-blue-50 ${
													selectedRole === "Seller"
														? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
														: "border-gray-200 text-gray-600"
												}`}
											>
												<input
													type="radio"
													value="Seller"
													className="sr-only"
													{...register("role")}
												/>
												<StoreIcon className={`w-5 h-5 mr-2 ${selectedRole === "Seller" ? "text-blue-600" : "text-gray-400"}`} />
												<span className="font-medium text-sm">Seller</span>
											</label>
										</div>
									</div>

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
											<button
												type="button"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												className="absolute inset-y-0 right-0 pr-3 flex items-center p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
											>
												{showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
											</button>
										</div>
										{errors.confirmPassword && (
											<p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
										)}
									</div>

									<button
										type="button"
										onClick={onNextStep}
										className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 mt-2"
									>
										Next
										<ChevronRightIcon className="w-5 h-5 ml-1" />
									</button>

									<div className="relative mt-4">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-gray-200"></div>
										</div>
										<div className="relative flex justify-center text-xs uppercase tracking-wide">
											<span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3 mt-4">
										<button type="button" className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
											<GoogleIcon className="h-5 w-5 mr-2" />
											Google
										</button>
										<button type="button" className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
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
											{["male", "female"].map((g) => (
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
														{...register("gender", { required: "Required" })}
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
											className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
										>
											<ChevronLeftIcon className="w-5 h-5 mr-1" />
											Back
										</button>
										<button
											type="submit"
											disabled={isRegistering}
											className="flex-[2] flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
										>
											{isRegistering ? "Creating..." : "Create Account"}
										</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</form>

					<div className="mt-6 text-center text-sm text-gray-600">
						Have an account?{" "}
						<Link
							to="/login"
							className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
						>
							Log in
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default RegisterPage;
