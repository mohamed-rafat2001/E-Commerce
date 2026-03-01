import { motion } from 'framer-motion';
import { Button } from '../../../../../shared/ui/index.js';
import { FiImage, FiUpload, FiX, FiCheck, FiAlertCircle, FiGrid } from 'react-icons/fi';

const MediaStep = ({
	// Cover image
	fileInputRef,
	coverImagePreview,
	onCoverImageSelect,
	onRemoveCoverImage,
	isUploading,
	uploadProgress,
	// Additional images
	additionalImages,
	onAdditionalImagesSelect,
	onRemoveAdditionalImage,
	// Errors
	formErrors,
	setFormErrors,
}) => {
	const handleCoverSelect = (e) => {
		const result = onCoverImageSelect(e);
		if (result?.error) {
			setFormErrors(prev => ({ ...prev, image: result.error }));
		} else {
			setFormErrors(prev => ({ ...prev, image: null }));
		}
	};

	const handleAdditionalSelect = (e) => {
		const result = onAdditionalImagesSelect(e);
		if (result?.error) {
			setFormErrors(prev => ({ ...prev, additionalImages: result.error }));
		} else {
			setFormErrors(prev => ({ ...prev, additionalImages: null }));
		}
	};

	return (
		<motion.div
			key="step-media"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.25 }}
			className="space-y-6"
		>
			{/* Cover Image */}
			<div>
				<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
					<FiImage className="w-4 h-4 text-indigo-500" />
					Cover Image
				</label>
				<div className="flex items-start gap-5">
					<div 
						onClick={() => fileInputRef.current?.click()}
						className={`w-36 h-36 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-indigo-400 hover:bg-indigo-50/50 group shrink-0 ${
							formErrors.image ? 'border-rose-300 bg-rose-50' : 
							coverImagePreview ? 'border-indigo-200 shadow-md' : 'border-gray-200 bg-gray-50'
						}`}
					>
						{coverImagePreview ? (
							<img src={coverImagePreview} alt="Preview" className="w-full h-full object-cover" crossOrigin="anonymous" />
						) : (
							<div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-indigo-500 transition-colors">
								<div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
									<FiUpload className="w-5 h-5" />
								</div>
								<span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
							</div>
						)}
					</div>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleCoverSelect}
						className="hidden"
					/>
					<div className="flex-1 space-y-3">
						<div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
							<p className="text-xs text-gray-500 leading-relaxed">
								This will be the main image shown on your product card. Use a high-quality photo with good lighting.
							</p>
							<p className="text-[10px] text-gray-400 mt-1 font-medium">JPG, PNG, WebP • Max 5MB</p>
						</div>
						{coverImagePreview && (
							<Button variant="secondary" size="sm" type="button" onClick={onRemoveCoverImage} icon={<FiX className="w-3.5 h-3.5" />} className="!rounded-xl">
								Remove Image
							</Button>
						)}
						{isUploading && (
							<div className="space-y-1.5">
								<div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
									<motion.div 
										className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
										initial={{ width: 0 }}
										animate={{ width: `${uploadProgress}%` }}
									/>
								</div>
								<p className="text-xs text-gray-500 font-medium">{uploadProgress}% uploaded</p>
							</div>
						)}
						{formErrors.image && (
							<p className="text-xs text-rose-500 flex items-center gap-1">
								<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.image}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Additional Images */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700">
						<FiGrid className="w-4 h-4 text-purple-500" />
						Gallery Images
					</label>
					<span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
						{additionalImages.length}/10
					</span>
				</div>

				{/* Image Grid */}
				{additionalImages.length > 0 && (
					<div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-3">
						{additionalImages.map((image, index) => (
							<div key={index} className="relative group">
								<div className={`w-full aspect-square rounded-xl border-2 overflow-hidden transition-all ${
									image.isUploading ? 'border-amber-300 bg-amber-50 animate-pulse' :
									image.uploaded ? 'border-emerald-300 shadow-sm' :
									'border-gray-200 bg-gray-50 hover:border-indigo-300'
								}`}>
									{image.preview && (
										<img 
											src={image.preview} 
											alt={`Gallery ${index + 1}`}
											className="w-full h-full object-cover"
											crossOrigin="anonymous"
										/>
									)}
									{image.isUploading && (
										<div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
											<div className="text-center">
												<div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
												<span className="text-white text-[10px] font-bold">{image.uploadProgress}%</span>
											</div>
										</div>
									)}
									{image.uploaded && (
										<div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
											<FiCheck className="w-3 h-3 text-white" />
										</div>
									)}
								</div>
								<button
									type="button"
									onClick={() => onRemoveAdditionalImage(index)}
									className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
								>
									<FiX className="w-3 h-3" />
								</button>
							</div>
						))}
					</div>
				)}
				
				{/* Add Images Button */}
				{additionalImages.length < 10 && (
					<div>
						<input
							type="file"
							accept="image/*"
							onChange={handleAdditionalSelect}
							multiple
							className="hidden"
							id="additional-images-input"
						/>
						<label 
							htmlFor="additional-images-input"
							className="flex items-center justify-center gap-2 w-full py-3.5 px-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
						>
							<FiUpload className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
							<span className="text-sm text-gray-500 font-medium group-hover:text-indigo-600 transition-colors">
								Add Images ({10 - additionalImages.length} slots remaining)
							</span>
						</label>
						<p className="text-[10px] text-gray-400 mt-2 text-center font-medium">
							Select multiple images • JPG, PNG, WebP • Max 5MB each
						</p>
					</div>
				)}
				
				{formErrors.additionalImages && (
					<p className="text-xs text-rose-500 flex items-center gap-1 mt-2">
						<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.additionalImages}
					</p>
				)}
			</div>
		</motion.div>
	);
};

export default MediaStep;
