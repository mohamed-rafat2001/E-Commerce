import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useLogin from "./hooks/useLogin.jsx";
import { motion } from "framer-motion";

function LoginPage() {
	const { login, isLoggingIn } = useLogin();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm();

	function Submit(data) {
		login(data);
	}

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Left Side - Image */}
			<div className="hidden lg:flex w-1/2 bg-blue-600 justify-center items-center relative overflow-hidden">
				<div className="absolute inset-0 bg-black opacity-20 z-10"></div>
				<img 
					src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" 
					alt="E-commerce shopping" 
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="relative z-20 text-white p-12 text-center">
					<h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
					<p className="text-xl text-gray-100">Access your account and manage your orders.</p>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex justify-center items-center p-4 sm:p-12 w-full lg:w-1/2">
				<motion.div 
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-none lg:shadow-none"
				>
					<div className="text-center lg:text-left">
						<h2 className="mt-2 text-3xl font-extrabold text-gray-900">
							Login
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Please enter your details to sign in
						</p>
					</div>

					<form onSubmit={handleSubmit(Submit)} className="mt-8 space-y-6">
						<div className="space-y-5">
							{/* Email */}
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Email address
								</label>
								<input
									id="email"
									type="email"
									autoComplete="email"
									placeholder="yourname@example.com"
									className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
										errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300"
									}`}
									{...register("email", {
										required: "Email is required",
									})}
								/>
								{errors.email && (
									<p className="mt-1 text-xs text-red-500">
										{errors.email.message}
									</p>
								)}
							</div>

							{/* Password */}
							<div>
								<div className="flex items-center justify-between mb-1">
									<label
										htmlFor="password"
										className="block text-sm font-medium text-gray-700"
									>
										Password
									</label>
								</div>
								<input
									id="password"
									type="password"
									placeholder="••••••••"
									className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
										errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-300"
									}`}
									{...register("password", {
										required: "Password is required",
									})}
								/>
								{errors.password && (
									<p className="mt-1 text-xs text-red-500">
										{errors.password.message}
									</p>
								)}
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoggingIn}
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoggingIn ? "Logging in..." : "Log In"}
						</button>
					</form>

					<div className="mt-6 text-center lg:text-left">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
							>
								Create Account
							</Link>
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default LoginPage;
