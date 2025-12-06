import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import userIcon from "../../assets/user.png";
function SellerLinks() {
	return (
		<>
			<motion.div
				whileHover={{
					scale: 1.1,
					transition: { duration: 0.2, ease: "easeInOut" },
				}}
				className="w-full"
			>
				<NavLink to="personalDetails" className="side-Nav-Links  ">
					<img src={userIcon} alt="user" />
					<h1 className="hidden xl:block">Personal Details</h1>
				</NavLink>
			</motion.div>

			<NavLink to="/" className="side-Nav-Links  mt-4">
				<h1>Icon</h1>
				<h1 className="hidden xl:block">Shipping Addresses</h1>
			</NavLink>

			<NavLink to="/" className="side-Nav-Links  mt-4">
				<h1>Icon</h1>
				<h1 className="hidden xl:block">Payment Methods</h1>
			</NavLink>

			<NavLink to="/" className="side-Nav-Links  my-4">
				<h1>Icon</h1>
				<h1 className="hidden xl:block">Order History</h1>
			</NavLink>
		</>
	);
}
export default SellerLinks;
