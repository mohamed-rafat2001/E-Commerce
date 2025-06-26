function sendCookies(res, token) {
	const cookiesOptions = {
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};
	if (process.env.NODE_MODE === "PROD") cookiesOptions.secure = true;

	res.cookie("token", token, cookiesOptions);
}
export default sendCookies;
