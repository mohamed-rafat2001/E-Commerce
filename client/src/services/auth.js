import mainApi from "../api/mainApi";

// login func
export const LoginFunc = async (Credentials) => {
	try {
		const user = await mainApi.post("authentications/login", Credentials);

		return user;
	} catch (e) {
		console.log(e);
	}
};

// register func
export const RegisterFunc = async (Credentials) => {
	try {
		const user = await mainApi.post("authentications/signUp", Credentials);
		return user;
	} catch (e) {
		console.log(e);
	}
};

// logout func
export const LogoutFunc = async () => {
	const user = await mainApi.get("authentications/logOut");
	return user;
};
export const getMeFunc = async () => {
	try {
		const user = await mainApi.get("authentications/me");
		return user;
	} catch (e) {
		console.log(e);
	}
};
