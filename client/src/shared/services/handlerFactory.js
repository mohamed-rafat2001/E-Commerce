import mainApi from "../../app/api/mainApi";

// add func
export const addFunc = async (url, data) => {
	const res = await mainApi.post(url, data);
	return res;
};

// get func
export const getFunc = async (url, config = {}) => {
	const res = await mainApi.get(url, config);
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
