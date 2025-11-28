import mainApi from "../api/mainApi";

// login func
export const LoginFunc = async (Credentials) => {
	const user = await mainApi.post("authentications/login", Credentials);
	return user;
};

// register func
export const RegisterFunc = async (Credentials) => {
	const user = await mainApi.post("authentications/signUp", Credentials);
	return user;
};

// logout func
export const LogoutFunc = async () => {
	const user = await mainApi.get("authentications/logOut");
	return user;
};
export const getMeFunc = async () => {
	const user = await mainApi.get("authentications/me");
	return user;
};
