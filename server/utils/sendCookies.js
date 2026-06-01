const LOCAL_ORIGIN_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const shouldUseCrossSiteCookies = () => {
	const nodeMode = (process.env.NODE_MODE || process.env.NODE_ENV || "").toLowerCase();
	const deploymentContext = (process.env.CONTEXT || "").toLowerCase();
	const clientUrl = (process.env.CLIENT_URL || "").trim();
	const hasRemoteClient = clientUrl && !LOCAL_ORIGIN_REGEX.test(clientUrl);

	return nodeMode === "prod"
		|| nodeMode === "production"
		|| deploymentContext === "production"
		|| deploymentContext === "deploy-preview"
		|| Boolean(hasRemoteClient);
};

function sendCookies(res, accessToken, refreshToken) {
	const useCrossSiteCookies = shouldUseCrossSiteCookies();
	const commonOptions = {
		httpOnly: true,
		secure: useCrossSiteCookies,
		sameSite: useCrossSiteCookies ? "None" : "Lax",
	};

	if (accessToken !== undefined) {
		const accessOptions = {
			...commonOptions,
			expires: accessToken ? new Date(
				Date.now() + process.env.JWT_ACCESS_COOKIE_EXPIRES * 60 * 1000,
			) : new Date(0),
		};

		res.cookie("accessToken", accessToken || "", accessOptions);
	}

	if (refreshToken !== undefined) {
		const refreshOptions = {
			...commonOptions,
			expires: refreshToken ? new Date(
				Date.now() + process.env.JWT_REFRESH_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
			) : new Date(0),
		};

		res.cookie("refreshToken", refreshToken || "", refreshOptions);
	}
}
export default sendCookies;
