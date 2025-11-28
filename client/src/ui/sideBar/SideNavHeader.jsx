import { motion } from "motion/react";
import faceIcon from "../../assets/face-id.png";
function SideNaveHeader({ fullName, role }) {
	return (
		<div className="w-[80%] m-auto mb-4">
			<motion.div
				whileHover={{
					scale: 1.2,
					transition: { duration: 0.2, ease: "easeInOut" },
				}}
				className="flex items-center justify-center xl:flex-row flex-col xl:justify-start space-x-3  p-2"
			>
				<img src={faceIcon} alt="face" />
				<div className="hidden xl:block">
					<h1 className="text-blue-500 font-semibold text-center xl:text-start mt-2 lg:mt-0 text-md xl:text-md">
						{fullName}
					</h1>
					<p className="text-gray-500 text-center xl:text-start text-sm ">
						{role}
					</p>
				</div>
			</motion.div>
		</div>
	);
}
export default SideNaveHeader;
