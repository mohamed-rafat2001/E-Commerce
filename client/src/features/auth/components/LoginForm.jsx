import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "../../../shared/constants/icons.jsx";
import SocialLogin from "./SocialLogin.jsx";
import { Link } from "react-router-dom";

const LoginForm = ({ 
	register, 
	handleSubmit, 
	onSubmit, 
	errors, 
	isLoggingIn, 
	showPassword, 
	setShowPassword 
}) => {
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
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

			<SocialLogin />
		</form>
	);
};

export default LoginForm;
