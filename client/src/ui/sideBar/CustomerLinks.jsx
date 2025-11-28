import { NavLink } from "react-router-dom";
import userIcon from "../../assets/user.png";
import addressIcon from "../../assets/house.png";
import PaymentIcon from "../../assets/credit-card.png";
import orderIcon from "../../assets/order-history.png";
function CustomerLinks() {
	return (
		<>
			<NavLink to="personalDetails" className="side-Nav-Links  ">
				<img src={userIcon} alt="user" />
				<h1 className="hidden xl:block">Personal Details</h1>
			</NavLink>

			<NavLink to="shippingAddresses" className="side-Nav-Links  mt-4">
				<img src={addressIcon} alt="address" />
				<h1 className="hidden xl:block">Shipping Addresses</h1>
			</NavLink>

			<NavLink to="paymentMethods" className="side-Nav-Links  mt-4">
				<img src={PaymentIcon} alt="Payment" />
				<h1 className="hidden xl:block">Payment Methods</h1>
			</NavLink>

			<NavLink to="orderHistory" className="side-Nav-Links  my-4">
				<img src={orderIcon} alt="order" />
				<h1 className="hidden xl:block">Order History</h1>
			</NavLink>
		</>
	);
}
export default CustomerLinks;
