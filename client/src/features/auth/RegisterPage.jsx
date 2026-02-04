import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useRegister from "./hooks/useRegister.jsx";
import { motion, AnimatePresence } from "framer-motion";
import AuthBanner from "./components/AuthBanner.jsx";
import RegisterStepOne from "./components/RegisterStepOne.jsx";
import RegisterStepTwo from "./components/RegisterStepTwo.jsx";
import RegisterStepThreeSeller from "./components/RegisterStepThreeSeller.jsx";

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
		if (step === 1) {
			const fieldsStep1 = ["email", "password", "confirmPassword", "role"];
			const isStep1Valid = await trigger(fieldsStep1);
			if (isStep1Valid) {
				setStep(2);
			}
		} else if (step === 2) {
			const fieldsStep2 = ["firstName", "lastName", "phoneNumber", "gender"];
			const isStep2Valid = await trigger(fieldsStep2);
			if (isStep2Valid) {
				if (selectedRole === "Seller") {
					setStep(3);
				} else {
					// For Customer, submit here or trigger form submit
					handleSubmit(Submit)();
				}
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

	const totalSteps = selectedRole === "Seller" ? 3 : 2;
	const progressWidth = `${(step / totalSteps) * 100}%`;

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50">
			<AuthBanner 
				image="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
				title={<>Start Your <br /><span className="text-indigo-400">Next Chapter.</span></>}
				subtitle="Join millions of users. Shop the latest trends or start selling your own products today."
				accentColor="indigo"
			/>

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
							initial={{ width: "33%" }}
							animate={{ width: progressWidth }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						/>
					</div>

					<div className="text-center pt-2">
						<h2 className="text-2xl font-bold text-gray-900 tracking-tight">
							{step === 1 ? "Create account" : step === 2 ? "Your profile" : "Business Details"}
						</h2>
						<p className="mt-2 text-sm text-gray-500">
							{step === 1
								? "Enter your details to get started"
								: step === 2 
									? "Just a few more details"
									: "Complete your seller profile"}
						</p>
					</div>

					<form onSubmit={handleSubmit(Submit)} className="mt-6 space-y-5">
						<AnimatePresence mode="wait" initial={false} custom={step}>
							{step === 1 && (
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
									onNextStep={onNextStep} // Add this if needed for custom submission logic
									showNextButton={selectedRole === "Seller"}
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
