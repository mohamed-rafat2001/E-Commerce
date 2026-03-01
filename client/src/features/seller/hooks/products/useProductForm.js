import { useState, useEffect } from 'react';

const useProductForm = ({ product, isOpen }) => {
	const isEditing = !!product;
	const [currentStep, setCurrentStep] = useState(0);

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		brandId: '',
		primaryCategory: '',
		subCategory: null,
		countInStock: 0,
		status: 'draft',
		visibility: 'public',
		sizes: [],
		colors: [],
	});

	const [formErrors, setFormErrors] = useState({});

	// Reset form when product changes or modal opens
	useEffect(() => {
		if (isOpen) {
			setFormData({
				name: product?.name || '',
				description: product?.description || '',
				price: product?.price?.amount || '',
				brandId: product?.brandId?._id || product?.brandId || '',
				primaryCategory: product?.primaryCategory?._id || product?.primaryCategory || '',
				subCategory: product?.subCategory?._id || product?.subCategory || null,
				countInStock: product?.countInStock || 0,
				status: product?.status || 'draft',
				visibility: product?.visibility || 'public',
				sizes: product?.sizes || [],
				colors: product?.colors || [],
			});
			setFormErrors({});
			setCurrentStep(0);
		}
	}, [product, isOpen]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (formErrors[name]) {
			setFormErrors(prev => ({ ...prev, [name]: null }));
		}
	};

	const handleSelectChange = (name, value) => {
		const processedValue = (name === 'subCategory' && value === '') ? null : value;
		setFormData(prev => ({ ...prev, [name]: processedValue }));
		if (formErrors[name]) {
			setFormErrors(prev => ({ ...prev, [name]: null }));
		}
	};

	const validateForm = (additionalImages = []) => {
		const errors = {};
		if (!formData.name.trim()) errors.name = 'Product name is required';
		if (!formData.description.trim()) errors.description = 'Description is required';
		if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required';
		if (!formData.brandId) errors.brandId = 'Brand is required';
		if (!formData.primaryCategory) errors.primaryCategory = 'Primary category is required';

		const uploadingImages = additionalImages.filter(img => img.isUploading);
		const unuploadedImages = additionalImages.filter(img => !img.uploaded && !img.isUploading && img.file);

		if (uploadingImages.length > 0) {
			errors.additionalImages = 'Please wait for all images to finish uploading';
		} else if (unuploadedImages.length > 0) {
			errors.additionalImages = 'Some images failed to upload. Please remove and re-add them.';
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const validateCurrentStep = () => {
		const errors = {};
		if (currentStep === 0) {
			if (!formData.name.trim()) errors.name = 'Product name is required';
			if (!formData.description.trim()) errors.description = 'Description is required';
			if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required';
		}
		if (currentStep === 2) {
			if (!formData.brandId) errors.brandId = 'Brand is required';
			if (!formData.primaryCategory) errors.primaryCategory = 'Primary category is required';
		}
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const findFirstErrorStep = () => {
		const requiredFieldSteps = {
			name: 0, description: 0, price: 0,
			brandId: 2, primaryCategory: 2,
			additionalImages: 1,
		};
		const errs = {};
		if (!formData.name.trim()) errs.name = true;
		if (!formData.description.trim()) errs.description = true;
		if (!formData.price || parseFloat(formData.price) <= 0) errs.price = true;
		if (!formData.brandId) errs.brandId = true;
		if (!formData.primaryCategory) errs.primaryCategory = true;

		for (const key of Object.keys(errs)) {
			if (requiredFieldSteps[key] !== undefined) {
				return requiredFieldSteps[key];
			}
		}
		return 0;
	};

	const handleNext = () => {
		if (validateCurrentStep()) {
			setCurrentStep(prev => Math.min(prev + 1, 3));
		}
	};

	const handleBack = () => {
		setCurrentStep(prev => Math.max(prev - 1, 0));
	};

	// --- Tag helpers (sizes & colors) ---
	const [sizeInput, setSizeInput] = useState('');
	const [colorInput, setColorInput] = useState('');

	const addSize = () => {
		const val = (sizeInput || '').trim().toUpperCase();
		if (!val || formData.sizes.includes(val)) return;
		setFormData(prev => ({ ...prev, sizes: [...prev.sizes, val] }));
		setSizeInput('');
	};

	const removeSize = (value) => {
		setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== value) }));
	};

	const addColor = () => {
		const val = (colorInput || '').trim();
		if (!val) return;
		const isValidColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val) || /^[a-zA-Z]+$/.test(val);
		if (!isValidColor) {
			setFormErrors(prev => ({ ...prev, colors: 'Please enter a valid color (hex code or name)' }));
			return;
		}
		const normalizedColor = val.startsWith('#') ? val.toUpperCase() : val.toLowerCase();
		if (formData.colors.includes(normalizedColor)) return;
		setFormData(prev => ({ ...prev, colors: [...prev.colors, normalizedColor] }));
		setColorInput('');
		setFormErrors(prev => ({ ...prev, colors: null }));
	};

	const removeColor = (value) => {
		setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== value) }));
	};

	return {
		isEditing,
		formData,
		formErrors,
		setFormErrors,
		currentStep,
		setCurrentStep,
		handleChange,
		handleSelectChange,
		validateForm,
		validateCurrentStep,
		findFirstErrorStep,
		handleNext,
		handleBack,

		// Tags
		sizeInput,
		setSizeInput,
		addSize,
		removeSize,
		colorInput,
		setColorInput,
		addColor,
		removeColor,
	};
};

export default useProductForm;
