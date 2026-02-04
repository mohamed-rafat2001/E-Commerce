import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// login func
export const LoginFunc = (Credentials) =>
	addFunc("authentications/login", Credentials);

// register func
export const RegisterFunc = (Credentials) =>
	addFunc("authentications/signUp", Credentials);

// logout func
export const LogoutFunc = () => getFunc("authentications/logOut");

// get user data
export const getMeFunc = () => getFunc("authentications/me");

// update personal details func
export const updatePersonalDetails = (data) =>
	updateFunc("authentications/me", data);

// delete me func
export const deleteMe = () => deleteFunc("authentications/me");

// forgot password func
export const forgotPassword = (email) =>
	addFunc("authentications/forgotPassword", email);

// reset password func
export const resetPassword = (passwords) =>
	updateFunc("authentications/resetPassword", passwords);

// update password
export const updatePassword = (passwords) =>
	updateFunc("authentications/updatePassword", passwords);
