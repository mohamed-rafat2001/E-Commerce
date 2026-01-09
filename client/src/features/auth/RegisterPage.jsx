import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useRegister from "./hooks/useRegister.jsx";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";

function RegisterPage() {
	const { registerUser, isRegistering } = useRegister();
	const {
		handleSubmit,
		register,
		getValues,
		formState: { errors },
	} = useForm();
	function Submit(data) {
		registerUser(data);
	}
	return (
		<div className="flex justify-center items-center min-h-screen ">
			<div className="container my-5 bg-white shadow p-10 rounded-xl  w-5/12  ">
				<div className="space-y-3 mb-2">
					<h1 className="font-extrabold text-4xl text-center text-black">
						Create Your Account
					</h1>
					<p className="text-center text-gray-500 text-md">
						Sign up to start buying and selling.{" "}
					</p>
				</div>
				<form onSubmit={handleSubmit(Submit)}>
					<div className="mb-4">
						<label
							htmlFor="firstName"
							className="block text-md text-gray-800 font-bold mb-2"
						>
							First Name
						</label>
						<input
							type="text"
							id="firstName"
							placeholder="Enter your first name"
							className="shadow  appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-md w-full  px-3 text-gray-700 leading-10 focus:outline-none "
							{...register("firstName", {
								required: "First name is required",
								minLength: {
									value: 3,
									message: "First name must be at least 3 characters",
								},
							})}
						/>
						{errors?.firstName?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.firstName.message}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label
							htmlFor="lastName"
							className="block text-md text-gray-800 font-bold mb-2"
						>
							Last Name
						</label>
						<input
							type="text"
							id="lastName"
							placeholder="Enter your last name"
							className="shadow  appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-md w-full  px-3 text-gray-700 leading-10 focus:outline-none "
							{...register("lastName", {
								required: "Last name is required",
								minLength: {
									value: 3,
									message: "last name must be at least 3 characters",
								},
							})}
						/>
						{errors?.lastName?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.lastName.message}
							</p>
						)}
					</div>
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
								validate: (value) => {
									if (isEmail(value)) {
										return true;
									}
									return "Email is not valid";
								},
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
							htmlFor="phoneNumber"
							className="block text-md text-gray-800 font-bold mb-2"
						>
							Phone Number
						</label>
						<input
							type="text"
							id="phoneNumber"
							placeholder="Enter your phone number"
							className="shadow  appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-md w-full  px-3 text-gray-700 leading-10 focus:outline-none "
							{...register("phoneNumber", {
								required: "Phone number is required",
								minLength: {
									value: 3,
									message: "Phone number must be at least 3 characters",
								},
							})}
						/>
						{errors?.phoneNumber?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.phoneNumber.message}
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
								minLength: 8,
								validate: (value) => {
									if (isStrongPassword(value)) {
										return true;
									}
									return "Your password is very weak! Please in strong password";
								},
							})}
						/>
						<p className="text-gray-500 text-xs mt-1">
							Minimum 8 characters, one uppercase, one number and one special
							case character
						</p>
						{errors?.password?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.password.message}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label
							htmlFor="confirmPassword"
							className="block text-md text-gray-800 font-bold mb-2"
						>
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							placeholder="Confirm your password"
							className="shadow  appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-md w-full  px-3 text-gray-700 leading-10 focus:outline-none "
							{...register("confirmPassword", {
								required: "Confirm password is required",
								validate: (value) => {
									if (getValues("password") === value) {
										return true;
									}
									return "Passwords Not Matched";
								},
							})}
						/>
						{errors?.confirmPassword?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.confirmPassword.message}
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-md text-gray-800 font-bold mb-2">
							Gender
						</label>
						<div className="flex  space-x-2">
							<div className="flex items-center outline-2  w-1/2 bg-blue-200 outline-blue-400  rounded-md py-2 px-5">
								<input
									type="radio"
									id="male"
									name="gender"
									value="male"
									className="mr-2  accent-blue-600   "
									{...register("gender", {
										required: "Gender is required",
									})}
								/>
								<label
									htmlFor="male"
									className="text-md text-gray-800 font-bold mb-2"
								>
									Male
								</label>
							</div>
							<div className="flex items-center outline-2  w-1/2 bg-blue-200 outline-blue-400 rounded-md py-2 px-5">
								<input
									type="radio"
									id="female"
									name="gender"
									value="female"
									className="mr-2 accent-blue-600"
									{...register("gender")}
								/>
								<label
									htmlFor="female"
									className="text-md text-gray-800 font-bold mb-2"
								>
									female
								</label>
							</div>
						</div>
						{errors?.gender?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.gender.message}
							</p>
						)}
					</div>
					<div className="mb-4">
						<lable className="block text-md text-gray-800 font-bold mb-2">
							I'm a
						</lable>
						<div className="flex items-center space-x-2">
							<div className="flex items-center outline-2  w-1/2 bg-blue-200 outline-blue-400 rounded-md py-2 px-5">
								<input
									type="radio"
									id="Customer"
									name="role"
									value="Customer"
									className="mr-2 accent-blue-600 "
									{...register("role", {
										// required: "Please select who are you ",
									})}
								/>
								<label
									htmlFor="Customer"
									className="text-md text-gray-800 font-bold mb-2"
								>
									Customer
								</label>
							</div>
							<div className="flex items-center outline-2  w-1/2 bg-blue-200 outline-blue-400 rounded-md py-2 px-5">
								<input
									type="radio"
									id="Seller"
									name="role"
									value="Seller"
									className="mr-2 accent-blue-600 "
									{...register("role", {
										required: "Please select who are you ",
									})}
								/>
								<label
									htmlFor="Seller"
									className="text-md text-gray-800 font-bold mb-2"
								>
									Seller
								</label>
							</div>
						</div>
						{errors?.role?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.role.message}
							</p>
						)}
					</div>
					<button
						type="submit"
						className=" cursor-pointer w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline"
						disabled={isRegistering}
					>
						Create Account
					</button>
					<p className="text-center text-md text-gray-500  mt-4">
						Already have an account?{" "}
						<span>
							<Link to="/login" className="text-blue-500">
								Login
							</Link>
						</span>
					</p>
				</form>
			</div>
		</div>
	);
}
export default RegisterPage;
