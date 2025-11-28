import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuth";

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
		<div className="flex justify-center items-center min-h-screen ">
			<div className="container my-5 bg-white shadow p-10 rounded-xl  w-5/12  ">
				<div className="space-y-3 mb-2">
					<h1 className="font-extrabold text-4xl text-center text-black">
						Welcome Back
					</h1>
					<p className="text-center text-gray-500 text-md">
						Log in to continue to your account.{" "}
					</p>
				</div>
				<form onSubmit={handleSubmit(Submit)}>
					<div className="mb-4">
						<label
							htmlFor="Email"
							className="block text-md text-gray-800 font-bold mb-2"
						>
							Email Address
						</label>
						<input
							type="text"
							id="Email"
							placeholder="yourname@example.com"
							className="shadow  appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-md w-full  px-3 text-gray-700 leading-10 focus:outline-none "
							{...register("email", {
								required: "Email is required",
							})}
						/>
						{errors?.email?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.email.message}
							</p>
						)}
					</div>

					<div className="mb-4">
						<label
							htmlFor="password"
							className="block text-md text-gray-800 font-bold mb-2"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							placeholder="Enter your password"
							className="shadow  appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-md w-full  px-3 text-gray-700 leading-10 focus:outline-none "
							{...register("password", {
								required: "Password is required",
							})}
						/>
						{errors?.password?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.password.message}
							</p>
						)}
					</div>
					<button
						type="submit"
						className="cursor-pointer w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline"
						disabled={isLoggingIn}
					>
						Login In
					</button>
					<p className="text-center text-md text-gray-500  mt-4">
						Don't have an account?{" "}
						<span>
							<Link to="/register" className="text-blue-500">
								Create Account
							</Link>
						</span>
					</p>
				</form>
			</div>
		</div>
	);
}
export default LoginPage;
