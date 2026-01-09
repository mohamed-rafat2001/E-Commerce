import defaultimage from "../../../assets/WhatsApp Image 2025-12-06 at 03.47.26_4f0abdad.jpg";
import { motion } from "framer-motion";
import useCurrentUser from "../../../hooks/useCurrentUser.js";
const ProfileImage = () => {
	const { userRole, user } = useCurrentUser();
	return (
		<div className="flex justify-between items-center">
			<div className="w-10/12 flex space-x-5  ">
				<img
					src={defaultimage}
					alt="profile image"
					className="w-30 h-30 rounded-full hover:outline-2  hover:outline-blue-500
                    object-cover object-center cursor-pointer "
				/>
				<div className="mt-3">
					<h1 className="text-blue-500 font-semibold text-lg">
						{user?.userId.firstName} {user?.userId.lastName}
					</h1>
					<p className="text-gray-500  text-sm ">{userRole}</p>
				</div>
			</div>

			<motion.div
				whileHover={{
					scale: 1.1,
					transition: { duration: 0.2, ease: "easeInOut" },
				}}
				className="w-2/12 text-end"
			>
				<button className="cursor-pointer  py-1 hover:bg-blue-100  text-gray-700  font-semibold hover:text-blue-500 border border-gray-300 px-4 rounded-md focus:outline-none focus:shadow-outline">
					Upload image
				</button>
			</motion.div>
		</div>
	);
};

export default ProfileImage;
