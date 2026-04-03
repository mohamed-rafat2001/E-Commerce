import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthBanner from "../components/AuthBanner.jsx";
import RegisterStepOne from "../components/RegisterStepOne.jsx";
import RegisterStepTwo from "../components/RegisterStepTwo.jsx";
import RegisterStepThreeSeller from "../components/RegisterStepThreeSeller.jsx";
import RegisterStepThreeCustomer from "../components/RegisterStepThreeCustomer.jsx";
import { OrderIcon, StoreIcon, ChevronRightIcon } from "../../../shared/constants/icons.jsx";
import useRegisterPage from "../hooks/useRegisterPage.js";

function RegisterPage() {
	const page = useRegisterPage();
	const { handleSubmit, register, getValues, watch, formState: { errors } } = page.form;

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50">
			<AuthBanner
				image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop"
				title={<>Start Your <br /><span className="text-indigo-400">Next Chapter.</span></>}
				subtitle="Join millions of users. Shop the latest trends or start selling your own products today."
				accentColor="indigo"
			/>

			<div className="flex-1 flex justify-center items-start p-4 pt-20 md:pt-24 lg:pt-20 w-full lg:w-1/2 h-full overflow-y-auto">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-md w-full bg-white shadow-[0_24px_60px_rgba(15,23,42,0.35)] rounded-4xl p-8 space-y-5 ring-1 ring-gray-100/50 relative overflow-hidden"
				>
					<div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
						<motion.div className="h-full bg-blue-600" initial={{ width: "33%" }} animate={{ width: page.progressWidth }} transition={{ duration: 0.5, ease: "easeInOut" }} />
					</div>

					<div className="text-center pt-2">
						<h2 className="text-2xl font-bold text-gray-900 tracking-tight">{page.stepTitle}</h2>
						<p className="mt-2 text-sm text-gray-500">{page.stepSubtitle}</p>
					</div>

					<form onSubmit={handleSubmit(page.onSubmit)} className="mt-6 space-y-5">
						<AnimatePresence mode="wait" initial={false} custom={page.step}>
							{page.step === 1 && (
								<motion.div key="role-selection" variants={page.variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} custom={1} className="space-y-6">
									<div className="grid grid-cols-2 gap-4">
										<label className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all hover:bg-blue-50 ${page.selectedRole === "Customer" ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
											<input type="radio" value="Customer" className="sr-only" {...register("role")} />
											<OrderIcon className={`w-12 h-12 mb-3 ${page.selectedRole === "Customer" ? "text-blue-600" : "text-gray-400"}`} />
											<span className="font-bold text-lg">Customer</span>
											<p className="text-sm mt-1 text-center">Buy products from sellers</p>
										</label>
										<label className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all hover:bg-blue-50 ${page.selectedRole === "Seller" ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
											<input type="radio" value="Seller" className="sr-only" {...register("role")} />
											<StoreIcon className={`w-12 h-12 mb-3 ${page.selectedRole === "Seller" ? "text-blue-600" : "text-gray-400"}`} />
											<span className="font-bold text-lg">Seller</span>
											<p className="text-sm mt-1 text-center">Sell your products</p>
										</label>
									</div>
									<button type="button" onClick={page.onNextStep} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 cursor-pointer">
										Next Step <ChevronRightIcon className="ml-2 h-5 w-5" />
									</button>
								</motion.div>
							)}
							{page.step === 2 && (
								<RegisterStepOne
									register={register} errors={errors} selectedRole={page.selectedRole}
									showPassword={page.showPassword} setShowPassword={page.setShowPassword}
									showConfirmPassword={page.showConfirmPassword} setShowConfirmPassword={page.setShowConfirmPassword}
									onNextStep={page.onNextStep} getValues={getValues} variants={page.variants}
								/>
							)}
							{page.step === 3 && (
								<RegisterStepTwo
									register={register} errors={errors} selectedGender={page.selectedGender}
									onPrevStep={page.onPrevStep} isRegistering={page.isRegistering}
									variants={page.variants} onNextStep={page.onNextStep}
									showNextButton={true} selectedRole={page.selectedRole}
								/>
							)}
							{page.step === 4 && page.selectedRole === "Seller" && (
								<RegisterStepThreeSeller register={register} errors={errors} onPrevStep={page.onPrevStep} isRegistering={page.isRegistering} variants={page.variants} watch={watch} />
							)}
							{page.step === 4 && page.selectedRole === "Customer" && (
								<RegisterStepThreeCustomer register={register} errors={errors} onPrevStep={page.onPrevStep} isRegistering={page.isRegistering} variants={page.variants} selectedRole={page.selectedRole} />
							)}
						</AnimatePresence>
					</form>

					<div className="mt-6 text-center text-sm text-gray-600">
						Have an account?{" "}
						<Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors">Log in</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default RegisterPage;
