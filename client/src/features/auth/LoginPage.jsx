import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useLogin from "./hooks/useLogin.jsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
	MailIcon, 
	LockIcon, 
	EyeIcon, 
	EyeOffIcon, 
	GoogleIcon, 
	FacebookIcon 
} from "../../shared/constants/icons.jsx";

function LoginPage() {
	const { login, isLoggingIn } = useLogin();
	const [showPassword, setShowPassword] = useState(false);
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm();

	function Submit(data) {
		login(data);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50">
			{/* Left Side - Image */}
			<div className="hidden lg:flex w-1/2 h-full items-center justify-center">
				<div className="relative w-full h-full overflow-hidden">
					<div className="absolute inset-0 bg-blue-900/20 z-10 mix-blend-multiply"></div>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
					<img 
						src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" 
						alt="E-commerce shopping" 
						className="absolute inset-0 w-full h-full object-cover"
					/>
					<div className="relative z-20 h-full flex flex-col justify-end p-16 text-white">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							<div className="w-12 h-1 bg-blue-500 mb-6 rounded-full"></div>
							<h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
								Experience <br />
								<span className="text-blue-400">Better Shopping.</span>
							</h1>
							<p className="text-lg text-gray-200 leading-relaxed max-w-md opacity-90 font-medium">
								Access your account, track your orders, and discover new trends in our exclusive collection.
							</p>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex justify-center items-center p-4 w-full lg:w-1/2 h-full overflow-y-auto">
				<motion.div 
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-md w-full bg-white shadow-[0_24px_60px_rgba(15,_23,_42,_0.35)] rounded-[2rem] p-8 space-y-5 ring-1 ring-gray-100/50"
				>
					<div className="text-center">
						<h2 className="text-2xl font-bold text-gray-900 tracking-tight">
							Log in to your account
						</h2>
						<p className="mt-2 text-sm text-gray-500">
							Welcome back! Please enter your details.
						</p>
					</div>

					<form onSubmit={handleSubmit(Submit)} className="mt-6 space-y-5">
						<div className="space-y-4">
							{/* Email */}
							<div>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
										<MailIcon className="h-5 w-5" />
									</div>
									<input
										id="email"
										type="email"
										autoComplete="email"
										placeholder="Email address"
										className={`appearance-none block w-full pl-11 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
											errors.email ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
										}`}
										{...register("email", {
											required: "Required",
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: "Invalid email"
											}
										})}
									/>
								</div>
								{errors.email && (
									<p className="mt-1 text-xs text-red-500 font-medium">
										{errors.email.message}
									</p>
								)}
							</div>

							{/* Password */}
							<div>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
										<LockIcon className="h-5 w-5" />
									</div>
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Password"
										className={`appearance-none block w-full pl-11 pr-11 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
											errors.password ? "border-red-300 focus:ring-red-500/20" : "border-gray-200"
										}`}
										{...register("password", {
											required: "Required",
										})}
									/>
									<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
										>
											{showPassword ? (
												<EyeOffIcon className="h-5 w-5" />
											) : (
												<EyeIcon className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>
								{errors.password && (
									<p className="mt-1 text-xs text-red-500 font-medium">
										{errors.password.message}
									</p>
								)}
							</div>
						</div>

						<div className="flex items-center justify-between pt-1">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
									Remember me
								</label>
							</div>

							<div className="text-sm">
								<a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
									Forgot password?
								</a>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoggingIn}
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{isLoggingIn ? "Logging in..." : "Log In"}
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
							<button
								type="button"
								className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
							>
								<GoogleIcon className="h-5 w-5 mr-2" />
								<span className="sr-only">Sign in with Google</span>
								Google
							</button>
							<button
								type="button"
								className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
							>
								<FacebookIcon className="h-5 w-5 mr-2 text-blue-600" />
								<span className="sr-only">Sign in with Facebook</span>
								Facebook
							</button>
						</div>
					</form>

					<div className="mt-6 text-center text-sm text-gray-600">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
						>
							Sign up
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default LoginPage;
