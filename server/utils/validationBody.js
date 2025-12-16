const validationBody = (obj, allowedFields) => {
	if (!obj) return {};
	const newObject = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObject[el] = obj[el];
	});
	return newObject;
};
export default validationBody;

// const validationBody = (obj, objectFields) => {
// 	let newObject = {};
// 	// Loop through the object fields
// 	for (const field of objectFields) {
// 		if (field in obj) {
// 			// Check if property exists (not if it's truthy)
// 			newObject[field] = obj[field];
// 		} else {
// 			return {};
// 		}
// 	}
