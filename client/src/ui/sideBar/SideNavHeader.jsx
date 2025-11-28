function SideNaveHeader({ fullName, email }) {
	return (
		<div className="w-[80%] m-auto mb-4">
			<div className="flex  justify-start space-x-3  p-2">
				<h1>Icon</h1>
				<div>
					<h1 className="text-gray-700 font-semibold text-lg">{fullName}</h1>
					<p className="text-gray-500  text-sm">{email}</p>
				</div>
			</div>
		</div>
	);
}
export default SideNaveHeader;
