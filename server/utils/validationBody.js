const validationBody = (obj, allowedFields) => {
	if (!obj) return {};
	const newObject = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObject[el] = obj[el];
	});
	return newObject;
};
export default validationBody;
