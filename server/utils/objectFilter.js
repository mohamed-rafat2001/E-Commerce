const objectFilter = (obj, objectFields) => {
	const newObject = {};
	Object.keys(obj).forEach((el) => {
		if (objectFields.includes(el)) newObject[el] = req.body[el];
	});
	return newObject;
};
export default objectFilter;
