import SideNavFooter from "./SideNavFooter";
import useCurrentUser from "../../hooks/useCurrentUser.js";
import CustomerLinks from "./CustomerLinks";
import SideNaveHeader from "./SideNavHeader";
import SellerLinks from "./SellerLinks";
import AdminLinks from "./AdminLinks";
import EmployeeLinks from "./EmployeeLinks";

function SideNavbar() {
	const { userRole, user } = useCurrentUser();
	return (
		<div className=" container sticky top-5  py-5 shadow rounded-xl flex flex-col justify-center items-center  bg-white ">
			<SideNaveHeader
				fullName={user?.userId.firstName + " " + user?.userId.lastName}
				role={userRole}
			/>
			{userRole === "Customer" && <CustomerLinks />}
			{userRole === "Seller" && <SellerLinks />}
			{userRole === "Admin" && <AdminLinks />}
			{userRole === "Employee" && <EmployeeLinks />}
			<SideNavFooter />
		</div>
	);
}
export default SideNavbar;
