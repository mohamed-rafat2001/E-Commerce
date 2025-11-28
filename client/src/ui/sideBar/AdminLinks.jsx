import { NavLink } from "react-router-dom";
import userIcon from "../../assets/user.png";
function AdminLinks() {
	return (
		<>
			<NavLink to="personalDetails" className="side-Nav-Links  ">
				<img src={userIcon} alt="user" />
				<h1 className="hidden xl:block">Personal Details</h1>
			</NavLink>

			<NavLink to="/" className="side-Nav-Links  mt-4">
				<h1>Icon</h1>
				<h1>Shipping Addresses</h1>
			</NavLink>

			<NavLink to="/" className="side-Nav-Links  mt-4">
				<h1>Icon</h1>
				<h1>Payment Methods</h1>
			</NavLink>

			<NavLink to="/" className="side-Nav-Links  my-4">
				<h1>Icon</h1>
				<h1>Order History</h1>
			</NavLink>
		</>
	);
}
export default AdminLinks;
