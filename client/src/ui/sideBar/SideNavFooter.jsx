import { NavLink } from "react-router-dom";
import settingsIcon from "../../assets/setting.png";
import logoutIcon from "../../assets/user-logout.png";
import { useLogout } from "../../hooks/useAuth";
function SideNavFooter() {
	const { logout } = useLogout();
	const handleLogout = () => {
		logout();
	};
	return (
		<div className=" w-full border-t border-gray-200 m-auto">
			<NavLink to="settings" className="side-Nav-Links  mt-4">
				<img src={settingsIcon} alt="settings" />
				<h1 className="hidden xl:block">Settings</h1>
			</NavLink>
			<NavLink
				to="/login"
				className="side-Nav-Links  text-red-500  mt-4"
				onClick={handleLogout}
			>
				<img src={logoutIcon} alt="logout" />
				<h1 className="hidden xl:block">Logout</h1>
			</NavLink>
		</div>
	);
}
export default SideNavFooter;
