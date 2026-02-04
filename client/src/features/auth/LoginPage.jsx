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
			<div className="hidden lg:flex w-1/2 bg-blue-600 justify-center items-center relative overflow-hidden h-full">
				<div className="absolute inset-0 bg-black opacity-30 z-10"></div>
				<img 
					src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" 
					alt="E-commerce shopping" 
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="relative z-20 text-white p-12 text-center max-w-lg">
					<h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome Back!</h1>
					<p className="text-lg text-gray-200 leading-relaxed">Access your account, track your orders, and discover new trends.</p>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex justify-center items-center p-4 sm:p-8 w-full lg:w-1/2 bg-white h-full overflow-y-auto">
				<motion.div 
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-md w-full space-y-6"
				>
					<div className="text-center lg:text-left">
						<h2 className="mt-2 text-2xl font-extrabold text-gray-900 tracking-tight">
							Log in to your account
						</h2>
						<p className="mt-1 text-sm text-gray-500">
							Welcome back! Please enter your details.
						</p>
					</div>

					<form onSubmit={handleSubmit(Submit)} className="mt-6 space-y-4">
						<div className="space-y-3">
							{/* Email */}
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Email
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
										<MailIcon className="h-5 w-5" />
									</div>
									<input
										id="email"
										type="email"
										autoComplete="email"
										placeholder="yourname@example.com"
										className={`appearance-none block w-full pl-10 pr-3 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
											errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300"
										}`}
										{...register("email", {
											required: "Email is required",
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: "Invalid email address"
											}
										})}
									/>
								</div>
								{errors.email && (
									<p className="mt-1 text-xs text-red-500">
										{errors.email.message}
									</p>
								)}
							</div>

							{/* Password */}
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
										<LockIcon className="h-5 w-5" />
									</div>
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										className={`appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
											errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-300"
										}`}
										{...register("password", {
											required: "Password is required",
										})}
									/>
									<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="text-gray-400 hover:text-gray-600 focus:outline-none"
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
									<p className="mt-1 text-xs text-red-500">
										{errors.password.message}
									</p>
								)}
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
									Remember for 30 days
								</label>
							</div>

							<div className="text-sm">
								<a href="#" className="font-medium text-blue-600 hover:text-blue-500">
									Forgot password?
								</a>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoggingIn}
							className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoggingIn ? "Logging in..." : "Log In"}
						</button>

						<div className="relative mt-4">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">Or continue with</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3 mt-4">
							<button
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
							>
								<GoogleIcon className="h-5 w-5 mr-2" />
								<span className="sr-only">Sign in with Google</span>
								Google
							</button>
							<button
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
							>
								<FacebookIcon className="h-5 w-5 mr-2 text-blue-600" />
								<span className="sr-only">Sign in with Facebook</span>
								Facebook
							</button>
						</div>
					</form>

					<div className="mt-4 text-center text-sm text-gray-600">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
						>
							Sign up for free
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default LoginPage;
