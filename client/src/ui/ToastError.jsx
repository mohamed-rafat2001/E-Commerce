function ToastError({ errorObj }) {
	return (
		<div>
			<h1 className="text-red-500 font-bold text-sm">{errorObj.title}</h1>
			<p className="text-red-500 text-xs">{errorObj.message}</p>
		</div>
	);
}
export default ToastError;
