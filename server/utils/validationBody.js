const validationBody = (obj, objectFields) => {
	let newObject = {};
	// Loop through the object fields
	for (const field of objectFields) {
		if (field in obj) {
			// Check if property exists (not if it's truthy)
			newObject[field] = obj[field];
		} else {
			return {};
		}
	}
	return newObject;
};
export default validationBody;
