import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '../../../../shared/ui/index.js';
import { FiBox, FiImage, FiTag, FiSettings, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useCategories from '../../../admin/hooks/categories/useCategories.js';
import { useSellerBrands } from '../../hooks/index.js';
import useProductForm from '../../hooks/products/useProductForm.js';
import useImageUpload from '../../hooks/products/useImageUpload.js';
import {
	StepIndicator,
	BasicInfoStep,
	MediaStep,
	DetailsStep,
	SettingsStep,
} from './product-form/index.js';

// Step configuration
const STEPS = [
	{ id: 'basic', label: 'Basic Info', icon: FiBox, description: 'Name, description & pricing' },
	{ id: 'media', label: 'Media', icon: FiImage, description: 'Cover image & gallery' },
	{ id: 'details', label: 'Details', icon: FiTag, description: 'Brand, categories & variants' },
	{ id: 'settings', label: 'Settings', icon: FiSettings, description: 'Status & visibility' },
];

const ProductFormModal = ({ isOpen, onClose, product = null, onSubmit, isLoading }) => {
	const { categories, isLoading: categoriesLoading } = useCategories();
	const { brands, isLoading: brandsLoading } = useSellerBrands();

	const form = useProductForm({ product, isOpen });
	const images = useImageUpload({ product, isOpen });

	// Derived options
	const categoryOptions = (categories || []).map(c => ({ value: c._id, label: c.name }));
	const brandOptions = (brands || []).map(b => ({ value: b._id, label: b.name }));
	const subCategoryOptions = (categories || [])
		.filter(c => c._id !== form.formData.primaryCategory)
		.map(c => ({ value: c._id, label: c.name }));

	// Submit handler
	const handleSubmitForm = async (e) => {
		e.preventDefault();
		if (!form.validateForm(images.additionalImages)) {
			form.setCurrentStep(form.findFirstErrorStep());
			return;
		}

		const { coverImage, error: coverError } = await images.uploadCoverImage();
		if (coverError) {
			form.setFormErrors(prev => ({ ...prev, image: coverError }));
			form.setCurrentStep(1);
			return;
		}

		const additionalImageUrls = images.getUploadedAdditionalImages();

		const submitData = {
			...form.formData,
			price: { amount: parseFloat(form.formData.price), currency: 'USD' },
		};

		if (coverImage) submitData.coverImage = coverImage;
		if (additionalImageUrls.length > 0) submitData.images = additionalImageUrls;

		onSubmit(submitData);
	};

	if (typeof document === 'undefined' || !isOpen) return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ type: 'spring', duration: 0.5, bounce: 0.25 }}
						className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
					>
						{/* Header */}
						<div className="shrink-0 border-b border-gray-100">
							<div className="px-6 pt-5 pb-4 flex items-center justify-between">
								<div>
									<h3 className="text-xl font-bold text-gray-900">
										{form.isEditing ? '✏️ Edit Product' : '✨ Add New Product'}
									</h3>
									<p className="text-xs text-gray-400 mt-0.5 font-medium">
										{STEPS[form.currentStep].description}
									</p>
								</div>
								<button
									onClick={onClose}
									className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
								>
									<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							{/* Step Indicators */}
							<div className="px-6 pb-4">
								<StepIndicator
									steps={STEPS}
									currentStep={form.currentStep}
									onStepClick={form.setCurrentStep}
									validateCurrentStep={form.validateCurrentStep}
								/>
							</div>
						</div>

						{/* Body */}
						<div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
							<form id="product-form" onSubmit={handleSubmitForm} className="p-6">
								<AnimatePresence mode="wait">
									{form.currentStep === 0 && (
										<BasicInfoStep
											formData={form.formData}
											formErrors={form.formErrors}
											onChange={form.handleChange}
										/>
									)}

									{form.currentStep === 1 && (
										<MediaStep
											fileInputRef={images.fileInputRef}
											coverImagePreview={images.coverImagePreview}
											onCoverImageSelect={images.handleCoverImageSelect}
											onRemoveCoverImage={images.removeCoverImage}
											isUploading={images.isUploading}
											uploadProgress={images.uploadProgress}
											additionalImages={images.additionalImages}
											onAdditionalImagesSelect={images.handleAdditionalImagesSelect}
											onRemoveAdditionalImage={images.removeAdditionalImage}
											formErrors={form.formErrors}
											setFormErrors={form.setFormErrors}
										/>
									)}

									{form.currentStep === 2 && (
										<DetailsStep
											formData={form.formData}
											formErrors={form.formErrors}
											onSelectChange={form.handleSelectChange}
											brands={brands}
											brandOptions={brandOptions}
											brandsLoading={brandsLoading}
											categoryOptions={categoryOptions}
											subCategoryOptions={subCategoryOptions}
											categoriesLoading={categoriesLoading}
											onClose={onClose}
											sizeInput={form.sizeInput}
											onSizeInputChange={form.setSizeInput}
											onAddSize={form.addSize}
											onRemoveSize={form.removeSize}
											colorInput={form.colorInput}
											onColorInputChange={form.setColorInput}
											onAddColor={form.addColor}
											onRemoveColor={form.removeColor}
										/>
									)}

									{form.currentStep === 3 && (
										<SettingsStep
											formData={form.formData}
											onSelectChange={form.handleSelectChange}
											brandOptions={brandOptions}
											categoryOptions={categoryOptions}
											coverImagePreview={images.coverImagePreview}
											uploadedImagesCount={images.additionalImages.filter(i => i.uploaded).length}
										/>
									)}
								</AnimatePresence>
							</form>
						</div>

						{/* Footer */}
						<div className="shrink-0 flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/50">
							<div>
								{form.currentStep > 0 && (
									<Button
										variant="ghost"
										type="button"
										onClick={form.handleBack}
										icon={<FiChevronLeft className="w-4 h-4" />}
										className="!rounded-xl"
									>
										Back
									</Button>
								)}
							</div>
							<div className="flex items-center gap-3">
								<Button variant="secondary" type="button" onClick={onClose} className="!rounded-xl">
									Cancel
								</Button>
								{form.currentStep < STEPS.length - 1 ? (
									<Button
										type="button"
										onClick={form.handleNext}
										icon={<FiChevronRight className="w-4 h-4" />}
										iconPosition="right"
										className="!rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600"
									>
										Next
									</Button>
								) : (
									<Button 
										type="submit" 
										form="product-form"
										loading={isLoading || images.isUploading}
										icon={form.isEditing ? <FiCheck className="w-4 h-4" /> : <FiImage className="w-4 h-4" />}
										className="!rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600"
									>
										{form.isEditing ? 'Update Product' : 'Add Product'}
									</Button>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	);
};

export default ProductFormModal;
