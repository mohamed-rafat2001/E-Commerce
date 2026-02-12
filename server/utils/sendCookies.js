function sendCookies(res, accessToken, refreshToken) {
	const commonOptions = {
		httpOnly: true,
		secure: process.env.NODE_MODE === "PROD",
		sameSite: process.env.NODE_MODE === "PROD" ? "None" : "Lax",
	};

	if (accessToken !== undefined) {
		const accessOptions = {
			...commonOptions,
			expires: accessToken ? new Date(
				Date.now() + process.env.JWT_ACCESS_COOKIE_EXPIRES * 60 * 1000
			) : new Date(0),
		};
		res.cookie("accessToken", accessToken || "", accessOptions);
	}

	if (refreshToken !== undefined) {
		const refreshOptions = {
			...commonOptions,
			expires: refreshToken ? new Date(
				Date.now() + process.env.JWT_REFRESH_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
			) : new Date(0),
		};
		res.cookie("refreshToken", refreshToken || "", refreshOptions);
	}
}
export default sendCookies;
