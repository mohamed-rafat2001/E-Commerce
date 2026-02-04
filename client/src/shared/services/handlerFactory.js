import mainApi from "../../api/mainApi";

// add func
export const addFunc = async (url, data) => {
	try {
		const res = await mainApi.post(url, data);
		return res;
	} catch (e) {
		return e;
	}
};

// get func
export const getFunc = async (url) => {
	try {
		const res = await mainApi.get(url);
		return res;
	} catch (e) {
		return e;
	}
};

export const deleteFunc = async (url) => {
	try {
		const res = await mainApi.delete(url);
		return res;
	} catch (e) {
		return e;
	}
};

// update func
export const updateFunc = async (url, data) => {
	try {
		const res = await mainApi.patch(url, data);
		return res;
	} catch (e) {
		return e;
	}
};
