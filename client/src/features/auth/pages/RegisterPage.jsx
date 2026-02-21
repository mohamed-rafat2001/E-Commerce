import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useRegister from "../hooks/useRegister.jsx";
import { motion, AnimatePresence } from "framer-motion";
import AuthBanner from "../components/AuthBanner.jsx";
import RegisterStepOne from "../components/RegisterStepOne.jsx";
import RegisterStepTwo from "../components/RegisterStepTwo.jsx";
import RegisterStepThreeSeller from "../components/RegisterStepThreeSeller.jsx";
import RegisterStepThreeCustomer from "../components/RegisterStepThreeCustomer.jsx";

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
		reset,
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
		if (step === 1) {
			const isRoleSelected = selectedRole === "Customer" || selectedRole === "Seller";
			if (isRoleSelected) {
				setStep(2);
			}
		} else if (step === 2) {
			const fieldsStep2 = ["email", "password", "confirmPassword"];
			const isStep2Valid = await trigger(fieldsStep2);
			if (isStep2Valid) {
				setStep(3);
			}
		} else if (step === 3) {
			const fieldsStep3 = ["firstName", "lastName", "phoneNumber", "gender"];
			const isStep3Valid = await trigger(fieldsStep3);
			if (isStep3Valid) {
				setStep(4);
			}
		}
	}

	function onPrevStep() {
		setStep((prev) => prev - 1);
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

	const totalSteps = 3;
	const progressWidth = `${(step / totalSteps) * 100}%`;

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50">
			<AuthBanner 
				image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop"
				title={<>Start Your <br /><span className="text-indigo-400">Next Chapter.</span></>}
				subtitle="Join millions of users. Shop the latest trends or start selling your own products today."
				accentColor="indigo"
			/>

			<div className="flex-1 flex justify-center items-center p-4 w-full lg:w-1/2 h-full overflow-y-auto">
				<motion.div 
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-md w-full bg-white shadow-[0_24px_60px_rgba(15,23,42,0.35)] rounded-4xl p-8 space-y-5 ring-1 ring-gray-100/50 relative overflow-hidden"
				>
					{/* Progress Bar */}
					<div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
						<motion.div
							className="h-full bg-blue-600"
							initial={{ width: "33%" }}
							animate={{ width: progressWidth }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						/>
					</div>

					<div className="text-center pt-2">
						<h2 className="text-2xl font-bold text-gray-900 tracking-tight">
							{step === 1 ? "Choose your role" : step === 2 ? "Create account" : step === 3 ? "Your profile" : selectedRole === "Seller" ? "Business Details" : "Shipping Address"}
						</h2>
						<p className="mt-2 text-sm text-gray-500">
							{step === 1
								? "Select if you want to buy or sell"
								: step === 2
									? "Enter your account details"
									: step === 3
										? "Just a few more details"
										: selectedRole === "Seller" ? "Complete your seller profile" : "Tell us where to deliver"}
						</p>
					</div>

					<form onSubmit={handleSubmit(Submit)} className="mt-6 space-y-5">
						<AnimatePresence mode="wait" initial={false} custom={step}>
							{step === 1 && (
								<motion.div
									key="role-selection"
									variants={variants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
									custom={1}
									className="space-y-6"
								>
									<div className="grid grid-cols-2 gap-4">
										<label
											className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all hover:bg-blue-50 ${
												selectedRole === "Customer"
													? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20"
													: "border-gray-200 text-gray-600 hover:border-blue-300"
											}`}
										>
											<input
												type="radio"
												value="Customer"
												className="sr-only"
												{...register("role")}
											/>
											<OrderIcon className={`w-12 h-12 mb-3 ${selectedRole === "Customer" ? "text-blue-600" : "text-gray-400"}`} />
											<span className="font-bold text-lg">Customer</span>
											<p className="text-sm mt-1 text-center">Buy products from sellers</p>
										</label>
										<label
											className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all hover:bg-blue-50 ${
												selectedRole === "Seller"
													? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20"
													: "border-gray-200 text-gray-600 hover:border-blue-300"
											}`}
										>
											<input
												type="radio"
												value="Seller"
												className="sr-only"
												{...register("role")}
											/>
											<StoreIcon className={`w-12 h-12 mb-3 ${selectedRole === "Seller" ? "text-blue-600" : "text-gray-400"}`} />
											<span className="font-bold text-lg">Seller</span>
											<p className="text-sm mt-1 text-center">Sell your products</p>
										</label>
									</div>
									<button
										type="button"
										onClick={onNextStep}
										className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 cursor-pointer"
									>
										Next Step
										<ChevronRightIcon className="ml-2 h-5 w-5" />
									</button>
								</motion.div>
							)}
							{step === 2 && (
								<RegisterStepOne 
									register={register}
									errors={errors}
									selectedRole={selectedRole}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
									showConfirmPassword={showConfirmPassword}
									setShowConfirmPassword={setShowConfirmPassword}
									onNextStep={onNextStep}
									getValues={getValues}
									variants={variants}
								/>
							)}

							{step === 2 && (
								<RegisterStepTwo 
									register={register}
									errors={errors}
									selectedGender={selectedGender}
									onPrevStep={onPrevStep}
									isRegistering={isRegistering}
									variants={variants}
									onNextStep={onNextStep} 
									showNextButton={selectedRole !== "Admin"}
									selectedRole={selectedRole}
								/>
							)}

							{step === 3 && selectedRole === "Seller" && (
								<RegisterStepThreeSeller 
									register={register}
									errors={errors}
									onPrevStep={onPrevStep}
									isRegistering={isRegistering}
									variants={variants}
								/>
							)}

							{step === 3 && selectedRole === "Customer" && (
								<RegisterStepThreeCustomer 
									register={register}
									errors={errors}
									onPrevStep={onPrevStep}
									isRegistering={isRegistering}
									variants={variants}
									selectedRole={selectedRole}
								/>
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
