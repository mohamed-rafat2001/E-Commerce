import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Modal, Input } from '../../../../shared/ui/index.js';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { uploadSingleImage } from '../../../../shared/services/uploadService.js';
import { toast } from 'react-hot-toast';

const CategoryFormModal = ({ isOpen, onClose, category, onSubmit, isLoading }) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		isActive: true,
		coverImage: { public_id: '', secure_url: '' }
	});

	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const fileInputRef = useRef(null);

	useEffect(() => {
		if (isOpen) {
			setFormData({
				name: category?.name || '',
				description: category?.description || '',
				isActive: category?.isActive !== undefined ? category.isActive : true,
				coverImage: category?.coverImage || { public_id: '', secure_url: '' }
			});
		}
	}, [isOpen, category]);

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			return toast.error("Please select a valid image file");
		}

		try {
			setUploading(true);
			setUploadProgress(0);
			
			const response = await uploadSingleImage(file, (progress) => {
				setUploadProgress(progress);
			});

			if (response.status === 'success') {
				setFormData(prev => ({
					...prev,
					coverImage: {
						public_id: response.data.public_id,
						secure_url: response.data.secure_url
					}
				}));
				toast.success("Image uploaded successfully!");
			}
		} catch (error) {
			toast.error("Failed to upload image. Please try again.");
			console.error("Upload error:", error);
		} finally {
			setUploading(false);
			setUploadProgress(0);
		}
	};

	const removeImage = () => {
		setFormData(prev => ({
			...prev,
			coverImage: { public_id: '', secure_url: '' }
		}));
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (uploading) return toast.error("Please wait for the image to finish uploading");
		onSubmit(formData);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={category ? "Edit Category" : "Add Category"}
			size="md"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 group hover:border-indigo-300 transition-colors relative min-h-[160px]">
					{formData.coverImage?.secure_url ? (
						<div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
							<img 
								src={formData.coverImage.secure_url} 
								alt="Preview" 
								className="w-full h-full object-cover"
								crossOrigin="anonymous"
							/>
							<button
								type="button"
								onClick={removeImage}
								className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
							>
								<FiX className="w-4 h-4" />
							</button>
						</div>
					) : (
						<div 
							onClick={() => fileInputRef.current?.click()}
							className="flex flex-col items-center cursor-pointer text-gray-500 group-hover:text-indigo-600 transition-colors"
						>
							<div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:shadow-indigo-100 transition-all">
								<FiUploadCloud className="w-6 h-6" />
							</div>
							<p className="text-sm font-semibold">Click to upload image</p>
							<p className="text-xs text-gray-400 mt-1">PNG, JPG or WebP up to 5MB</p>
						</div>
					)}

					<input 
						ref={fileInputRef}
						type="file" 
						className="hidden" 
						accept="image/*"
						onChange={handleFileChange}
						disabled={uploading}
					/>

					{uploading && (
						<div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
							<div className="w-2/3 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
								<motion.div 
									className="h-full bg-indigo-500"
									initial={{ width: 0 }}
									animate={{ width: `${uploadProgress}%` }}
								/>
							</div>
							<p className="text-sm font-bold text-indigo-600">Uploading {uploadProgress}%</p>
						</div>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
					<Input
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="e.g. Electronics"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
					<textarea
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						placeholder="Briefly describe this category..."
						className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white min-h-[100px]"
					/>
				</div>

				<div className="flex items-center gap-2 pt-2">
					<input
						type="checkbox"
						id="isActive"
						checked={formData.isActive}
						onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
						className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
					/>
					<label htmlFor="isActive" className="text-sm font-medium text-gray-700">
						Mark as active category
					</label>
				</div>
				
				<div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
					<Button variant="secondary" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" loading={isLoading || uploading}>
						{category ? "Update Category" : "Create Category"}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default CategoryFormModal;
