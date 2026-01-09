import PersonalDetails from "./components/PersonalDetails.jsx";
import ProfileImage from "./components/ProfileImage.jsx";
import { motion } from "framer-motion";
import { useState } from "react";

const PersonalDetailsPage = () => {
	const [updateDetails, setUpdateDetails] = useState(true);
	return (
		<div className="container  ">
			<div className="bg-white rounded-xl p-5">
				<ProfileImage />
			</div>
			<div className="bg-white rounded-xl  mt-5">
				<div className="mb-8 border-b p-5 flex justify-between items-center border-gray-200">
					<div className="w-10/12">
						<h1 className="font-bold text-2xl text-gray-700 mb-2">
							Personal information
						</h1>
						<p className="text-gray-500  text-sm ">
							Update your personal details here.
						</p>
					</div>
					<motion.div
						whileHover={{
							scale: 1.1,
							transition: { duration: 0.2, ease: "easeInOut" },
						}}
						className="w-2/12 text-end"
					>
						<button
							onClick={() => setUpdateDetails((prev) => !prev)}
							className="cursor-pointer py-1 hover:bg-blue-100  text-gray-700  font-semibold hover:text-blue-500 border border-gray-300 px-4 rounded-md focus:outline-none focus:shadow-outline"
						>
							{updateDetails ? "Update Details" : "Cancel"}
						</button>
					</motion.div>
				</div>
				<PersonalDetails update={updateDetails} />
			</div>
		</div>
	);
};

export default PersonalDetailsPage;
