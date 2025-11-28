import { NavLink } from "react-router-dom";
function SideNavFooter() {
	return (
		<div className=" w-full border-t border-gray-200 m-auto">
			<NavLink to="/" className="side-Nav-Links  mt-4">
				<h1>Icon</h1>
				<h1>Settings</h1>
			</NavLink>
			<NavLink
				to="/"
				className="flex items-center justify-start space-x-3 w-[80%] m-auto  rounded-md hover:shadow  p-2 text-red-500 hover:bg-blue-100 font-semibold text-md  mt-4"
			>
				<h1>Icon</h1>
				<h1>Logout</h1>
			</NavLink>
		</div>
	);
}
export default SideNavFooter;
