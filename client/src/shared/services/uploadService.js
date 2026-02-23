import mainApi from "../../app/api/mainApi";

/**
 * Upload a single image to the server
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback for upload progress
 */
export const uploadSingleImage = async (file, onProgress) => {
	const formData = new FormData();
	formData.append("image", file);

	const response = await mainApi.post("upload", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		onUploadProgress: (progressEvent) => {
			if (onProgress) {
				const percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				onProgress(percentCompleted);
			}
		},
	});

	return response.data; // Should return { status: 'success', data: { public_id, secure_url } }
};
