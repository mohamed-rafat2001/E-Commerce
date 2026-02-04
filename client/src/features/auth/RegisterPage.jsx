import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useRegister from "./hooks/useRegister.jsx";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon, ChevronLeftIcon } from "../../shared/constants/icons.jsx";

function RegisterPage() {
	const { registerUser, isRegistering } = useRegister();
	const [step, setStep] = useState(1);
	const {
		handleSubmit,
		register,
		getValues,
		trigger,
		formState: { errors },
	} = useForm({
		mode: "onChange",
	});

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
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction) => ({
			zIndex: 0,
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
		}),
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Left Side - Image */}
			<div className="hidden lg:flex w-1/2 bg-indigo-600 justify-center items-center relative overflow-hidden">
				<div className="absolute inset-0 bg-black opacity-20 z-10"></div>
				<img 
					src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
					alt="E-commerce lifestyle" 
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="relative z-20 text-white p-12 text-center max-w-lg">
					<h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
					<p className="text-xl text-gray-100">Start your journey with us today and discover amazing products.</p>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex justify-center items-center p-4 sm:p-12 w-full lg:w-1/2">
				<div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-none lg:shadow-none overflow-hidden relative">
					{/* Progress Bar */}
					<div className="absolute top-0 left-0 h-1 bg-gray-100 w-full">
						<motion.div
							className="h-full bg-blue-600"
							initial={{ width: "50%" }}
							animate={{ width: step === 1 ? "50%" : "100%" }}
							transition={{ duration: 0.3 }}
						/>
					</div>

					<div className="text-center lg:text-left mt-4">
						<h2 className="mt-2 text-3xl font-extrabold text-gray-900">
							{step === 1 ? "Create Account" : "Personal Details"}
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							{step === 1
								? "Start your journey with us"
								: "Tell us a bit more about yourself"}
						</p>
					</div>

					<form onSubmit={handleSubmit(Submit)} className="mt-8 space-y-6">
						<AnimatePresence mode="wait" initial={false}>
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
											I want to
										</label>
										<div className="grid grid-cols-2 gap-4">
											<label
												className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
													getValues("role") === "Customer"
														? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
														: "border-gray-200 hover:bg-gray-50"
												}`}
											>
												<input
													type="radio"
													value="Customer"
													className="sr-only"
													{...register("role", {
														required: "Please select a role",
													})}
												/>
												<span className="font-medium">Buy</span>
											</label>
											<label
												className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
													getValues("role") === "Seller"
														? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
														: "border-gray-200 hover:bg-gray-50"
												}`}
											>
												<input
													type="radio"
													value="Seller"
													className="sr-only"
													{...register("role", {
														required: "Please select a role",
													})}
												/>
												<span className="font-medium">Sell</span>
											</label>
										</div>
										{errors.role && (
											<p className="mt-1 text-xs text-red-500">
												{errors.role.message}
											</p>
										)}
									</div>

									{/* Email */}
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700"
										>
											Email address
										</label>
										<div className="mt-1">
											<input
												id="email"
												type="email"
												autoComplete="email"
												className={`appearance-none block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
													errors.email ? "border-red-300" : "border-gray-300"
												}`}
												{...register("email", {
													required: "Email is required",
													validate: (value) =>
														isEmail(value) || "Invalid email address",
												})}
											/>
											{errors.email && (
												<p className="mt-1 text-xs text-red-500">
													{errors.email.message}
												</p>
											)}
										</div>
									</div>

									{/* Password */}
									<div>
										<label
											htmlFor="password"
											className="block text-sm font-medium text-gray-700"
										>
											Password
										</label>
										<div className="mt-1">
											<input
												id="password"
												type="password"
												className={`appearance-none block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
													errors.password ? "border-red-300" : "border-gray-300"
												}`}
												{...register("password", {
													required: "Password is required",
													minLength: 8,
													validate: (value) =>
														isStrongPassword(value) ||
														"Password must be strong (8+ chars, 1 uppercase, 1 number, 1 symbol)",
												})}
											/>
											{errors.password && (
												<p className="mt-1 text-xs text-red-500">
													{errors.password.message}
												</p>
											)}
										</div>
									</div>

									{/* Confirm Password */}
									<div>
										<label
											htmlFor="confirmPassword"
											className="block text-sm font-medium text-gray-700"
										>
											Confirm Password
										</label>
										<div className="mt-1">
											<input
												id="confirmPassword"
												type="password"
												className={`appearance-none block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
													errors.confirmPassword
														? "border-red-300"
														: "border-gray-300"
												}`}
												{...register("confirmPassword", {
													required: "Please confirm your password",
													validate: (value) =>
														value === getValues("password") ||
														"Passwords do not match",
												})}
											/>
											{errors.confirmPassword && (
												<p className="mt-1 text-xs text-red-500">
													{errors.confirmPassword.message}
												</p>
											)}
										</div>
									</div>

									<button
										type="button"
										onClick={onNextStep}
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-6"
									>
										Next Step
										<ChevronRightIcon className="w-5 h-5 ml-2" />
									</button>
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
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="firstName"
												className="block text-sm font-medium text-gray-700"
											>
												First Name
											</label>
											<div className="mt-1">
												<input
													id="firstName"
													type="text"
													className={`appearance-none block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
														errors.firstName ? "border-red-300" : "border-gray-300"
													}`}
													{...register("firstName", {
														required: "First name is required",
														minLength: {
															value: 3,
															message: "Min 3 characters",
														},
													})}
												/>
												{errors.firstName && (
													<p className="mt-1 text-xs text-red-500">
														{errors.firstName.message}
													</p>
												)}
											</div>
										</div>
										<div>
											<label
												htmlFor="lastName"
												className="block text-sm font-medium text-gray-700"
											>
												Last Name
											</label>
											<div className="mt-1">
												<input
													id="lastName"
													type="text"
													className={`appearance-none block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
														errors.lastName ? "border-red-300" : "border-gray-300"
													}`}
													{...register("lastName", {
														required: "Last name is required",
														minLength: {
															value: 3,
															message: "Min 3 characters",
														},
													})}
												/>
												{errors.lastName && (
													<p className="mt-1 text-xs text-red-500">
														{errors.lastName.message}
													</p>
												)}
											</div>
										</div>
									</div>

									<div>
										<label
											htmlFor="phoneNumber"
											className="block text-sm font-medium text-gray-700"
										>
											Phone Number
										</label>
										<div className="mt-1">
											<input
												id="phoneNumber"
												type="tel"
												className={`appearance-none block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
													errors.phoneNumber ? "border-red-300" : "border-gray-300"
												}`}
												{...register("phoneNumber", {
													required: "Phone number is required",
													minLength: {
														value: 3,
														message: "Min 3 characters",
													},
												})}
											/>
											{errors.phoneNumber && (
												<p className="mt-1 text-xs text-red-500">
													{errors.phoneNumber.message}
												</p>
											)}
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Gender
										</label>
										<div className="flex space-x-4">
											{["male", "female"].map((g) => (
												<label
													key={g}
													className={`flex-1 flex items-center justify-center p-2 border rounded-xl cursor-pointer transition-all ${
														getValues("gender") === g
															? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
															: "border-gray-200 hover:bg-gray-50"
													}`}
												>
													<input
														type="radio"
														value={g}
														className="sr-only"
														{...register("gender", {
															required: "Gender is required",
														})}
													/>
													<span className="capitalize font-medium">{g}</span>
												</label>
											))}
										</div>
										{errors.gender && (
											<p className="mt-1 text-xs text-red-500">
												{errors.gender.message}
											</p>
										)}
									</div>

									<div className="flex gap-3 mt-6">
										<button
											type="button"
											onClick={onPrevStep}
											className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
										>
											<ChevronLeftIcon className="w-5 h-5 mr-1" />
											Back
										</button>
										<button
											type="submit"
											disabled={isRegistering}
											className="flex-[2] flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isRegistering ? "Creating Account..." : "Create Account"}
										</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</form>

					<div className="mt-6 text-center lg:text-left">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Log in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
