import { motion } from "framer-motion";

import defaultImage from "../../assets/WhatsApp Image 2025-12-06 at 03.47.26_4f0abdad.jpg";
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
				<img
					src={defaultImage}
					alt="face"
					className="w-20 h-20 rounded-full
                    object-cover object-center "
				/>
				<div className="hidden xl:block ">
					<h1 className="text-blue-500 overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold text-center xl:text-start mt-2 lg:mt-0 text-sm">
						{fullName}
					</h1>
					<p className="text-gray-500 text-center xl:text-start text-xs ">
						{role}
					</p>
				</div>
			</motion.div>
		</div>
	);
}
export default SideNaveHeader;
