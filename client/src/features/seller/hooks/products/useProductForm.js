import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../../../shared/validation/schemas.js';

const useProductForm = ({ product, isOpen }) => {
	const isEditing = !!product;

	const form = useForm({
		resolver: zodResolver(productSchema),
		mode: 'onChange',
		defaultValues: {
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
		},
	});

	const { reset, watch, setValue, trigger, formState: { errors } } = form;

	// Reset form when product changes or modal opens
	useEffect(() => {
		if (isOpen) {
			reset({
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
		}
	}, [product, isOpen, reset]);

	const currentStep = watch('currentStep') || 0;
	const setCurrentStep = (step) => setValue('currentStep', step);

	const handleNext = async () => {
		let fieldsToValidate = [];
		if (currentStep === 0) {
			fieldsToValidate = ['name', 'description', 'price'];
		} else if (currentStep === 2) {
			fieldsToValidate = ['brandId', 'primaryCategory'];
		}

		if (fieldsToValidate.length > 0) {
			const isValid = await trigger(fieldsToValidate);
			if (isValid) {
				setCurrentStep(Math.min(currentStep + 1, 3));
			}
		} else {
			setCurrentStep(Math.min(currentStep + 1, 3));
		}
	};

	const handleBack = () => {
		setCurrentStep(Math.max(currentStep - 1, 0));
	};

	// --- Tag helpers (sizes & colors) ---
	const addSize = (val) => {
		const current = watch('sizes') || [];
		const upVal = val.trim().toUpperCase();
		if (!upVal || current.includes(upVal)) return;
		setValue('sizes', [...current, upVal]);
	};

	const removeSize = (val) => {
		const current = watch('sizes') || [];
		setValue('sizes', current.filter(s => s !== val));
	};

	const addColor = (val) => {
		const current = watch('colors') || [];
		const normalizedColor = val.startsWith('#') ? val.toUpperCase() : val.toLowerCase();
		if (!normalizedColor || current.includes(normalizedColor)) return;
		setValue('colors', [...current, normalizedColor]);
	};

	const removeColor = (val) => {
		const current = watch('colors') || [];
		setValue('colors', current.filter(c => c !== val));
	};

	return {
		form,
		isEditing,
		currentStep,
		setCurrentStep,
		handleNext,
		handleBack,
		addSize,
		removeSize,
		addColor,
		removeColor,
		errors
	};
};

export default useProductForm;
