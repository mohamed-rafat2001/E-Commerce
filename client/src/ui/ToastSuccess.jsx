function ToastSuccess({ successObj }) {
	return (
		<div>
			<h1 className="text-green-500 font-bold text-sm">{successObj.title}</h1>
			<p className="text-green-500 text-xs">{successObj.message}</p>
		</div>
	);
}
export default ToastSuccess;
