import { useForm } from "react-hook-form";
import { useGetCurrentUser } from "../../hooks/useAuth";

const PersonalDetails = ({ update }) => {
	const { user } = useGetCurrentUser();
	const {
		handleSubmit,
		register,

		formState: { errors },
	} = useForm();
	function Submit() {}
	return (
		<div className="px-5">
			<form onSubmit={handleSubmit(Submit)}>
				<div className="flex mb-4 space-x-5">
					<div className="w-1/2">
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
							disabled={update}
							defaultValue={user?.userId?.firstName}
							className=" disabled:bg-blue-100 appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-xl w-full  px-3 text-gray-700 leading-10 focus:outline-none "
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
					<div className="w-1/2">
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
							disabled={update}
							defaultValue={user?.userId?.lastName}
							className=" disabled:bg-blue-100 bg-white border placeholder:text-sm border-gray-300  rounded-xl w-full  px-3 text-gray-700 leading-10 focus:outline-none "
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
				</div>
				<div className="flex space-x-5 mb-4">
					<div className="w-1/2">
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
							disabled={update}
							defaultValue={user?.userId?.email}
							className=" disabled:bg-blue-100  appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-xl w-full  px-3 text-gray-700 leading-10 focus:outline-none "
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
					<div className="w-1/2">
						<label
							htmlFor="phoneNumber"
							className="block text-md text-gray-800 font-bold mb-2"
						>
							Phone Number
						</label>
						<input
							type="text"
							id="phoneNumber"
							disabled={update}
							defaultValue={user?.phoneNumber}
							className=" disabled:bg-blue-100  appearance-none bg-white border placeholder:text-sm border-gray-300  rounded-xl w-full  px-3 text-gray-700 leading-10 focus:outline-none "
							{...register("phoneNumber", {
								required: "Phone Number is required",
							})}
						/>
						{errors?.phoneNumber?.message && (
							<p className="text-red-500 text-xs mt-1">
								*{errors.email.message}
							</p>
						)}
					</div>
				</div>
				<div className="flex justify-end space-x-3">
					<button
						type="submit"
						className="disabled:bg-blue-200 disabled:text-gray-400 disabled:cursor-not-allowed  cursor-pointer  bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline"
						disabled={update}
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	);
};

export default PersonalDetails;
