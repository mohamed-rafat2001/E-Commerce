import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import userIcon from "../../assets/user.png";
import addressIcon from "../../assets/house.png";
import PaymentIcon from "../../assets/credit-card.png";
import orderIcon from "../../assets/order-history.png";
function CustomerLinks() {
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
			<motion.div
				whileHover={{
					scale: 1.1,
					transition: { duration: 0.2, ease: "easeInOut" },
				}}
				className="w-full"
			>
				<NavLink to="shippingAddresses" className="side-Nav-Links  mt-4">
					<img src={addressIcon} alt="address" />
					<h1 className="hidden xl:block">Shipping Addresses</h1>
				</NavLink>
			</motion.div>
			<motion.div
				whileHover={{
					scale: 1.1,
					transition: { duration: 0.2, ease: "easeInOut" },
				}}
				className="w-full"
			>
				<NavLink to="paymentMethods" className="side-Nav-Links  mt-4">
					<img src={PaymentIcon} alt="Payment" />
					<h1 className="hidden xl:block">Payment Methods</h1>
				</NavLink>
			</motion.div>
			<motion.div
				whileHover={{
					scale: 1.1,
					transition: { duration: 0.2, ease: "easeInOut" },
				}}
				className="w-full"
			>
				<NavLink to="orderHistory" className="side-Nav-Links  my-4">
					<img src={orderIcon} alt="order" />
					<h1 className="hidden xl:block">Order History</h1>
				</NavLink>
			</motion.div>
		</>
	);
}
export default CustomerLinks;
