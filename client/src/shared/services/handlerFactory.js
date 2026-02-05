import mainApi from "../../api/mainApi";

// add func
export const addFunc = async (url, data) => {
	const res = await mainApi.post(url, data);
	return res;
};

// get func
export const getFunc = async (url) => {
	const res = await mainApi.get(url);
	return res;
};

export const deleteFunc = async (url) => {
	const res = await mainApi.delete(url);
	return res;
};

// update func
export const updateFunc = async (url, data) => {
	const res = await mainApi.patch(url, data);
	return res;
};
