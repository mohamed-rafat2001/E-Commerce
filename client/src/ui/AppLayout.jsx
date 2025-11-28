import { Outlet } from "react-router-dom";
import SideNavbar from "./sideBar/SideNavbar";
const AppLayout = () => {
	return (
		<div className="container">
			<div className="grid pt-10 space-x-10 pl-10 grid-cols-12">
				<div className="col-span-3 relative ">
					<SideNavbar />
				</div>
				<div className="col-span-9 min-h-screen">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
