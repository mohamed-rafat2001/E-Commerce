import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button } from '../../../shared/ui/index.js';
import useMutationFactory from '../../../shared/hooks/useMutationFactory.jsx';
import { addPaymentMethodFunc, updatePaymentMethodFunc } from '../services/customerService.js';

const PaymentMethodForm = ({ isOpen, onClose, initialData }) => {
	const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
		defaultValues: {
			type: 'Visa',
			holder: '',
			cardNumber: '',
			expiry: '',
			isDefault: false
		}
	});

	// Handle initialData for editing
	useEffect(() => {
		if (initialData) {
			setValue('type', initialData.type);
			setValue('holder', initialData.holder);
			setValue('cardNumber', initialData.last4 ? `•••• •••• •••• ${initialData.last4}` : '');
			setValue('expiry', initialData.expiry);
			setValue('isDefault', initialData.isDefault);
		} else {
			reset({
				type: 'Visa',
				holder: '',
				cardNumber: '',
				expiry: '',
				isDefault: false
			});
		}
	}, [initialData, setValue, reset]);

	const { mutate: addPayment, isPending: isAdding } = useMutationFactory(
		addPaymentMethodFunc,
		'customerProfile',
		'Failed to add payment method',
		'Payment method added successfully'
	);

	const { mutate: updatePayment, isPending: isUpdating } = useMutationFactory(
		updatePaymentMethodFunc,
		'customerProfile',
		'Failed to update payment method',
		'Payment method updated successfully'
	);

	const onSubmit = (data) => {
		// Extract last 4 digits if it's a new card number (not the masked one)
		let last4 = initialData?.last4;
		if (data.cardNumber && !data.cardNumber.includes('•')) {
			last4 = data.cardNumber.replace(/\s/g, '').slice(-4);
		}
		
		const paymentData = {
			type: data.type,
			holder: data.holder,
			last4: last4,
			expiry: data.expiry,
			isDefault: data.isDefault
		};

		if (initialData) {
			updatePayment({ 
				paymentMethodId: initialData._id, 
				paymentMethodData: paymentData 
			}, {
				onSuccess: () => {
					onClose();
				}
			});
		} else {
			addPayment(paymentData, { 
				onSuccess: () => {
					reset();
					onClose();
				}
			});
		}
	};

	const cardType = watch('type');

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Payment Method" : "Add Payment Method"} size="md">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Card Type Selector */}
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
					{['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'].map((type) => (
						<label 
							key={type}
							className={`relative flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 
								${cardType === type ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-200'}`}
						>
							<input 
								type="radio" 
								{...register('type')} 
								value={type} 
								className="sr-only" 
							/>
							<span className="text-2xl mb-1">
								{type === 'Visa' ? '💳' : 
								 type === 'Mastercard' ? '💳' : 
								 type === 'PayPal' ? '🅿️' : 
								 type === 'Apple Pay' ? '🍎' : '🔍'}
							</span>
							<span className="text-xs font-bold text-gray-700">{type}</span>
							{cardType === type && (
								<div className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
									<svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
									</svg>
								</div>
							)}
						</label>
					))}
				</div>

				<div className="space-y-4">
					<Input
						label="Card Holder Name"
						placeholder="e.g. JOHN DOE"
						{...register('holder', { required: 'Card holder name is required' })}
						error={errors.holder?.message}
					/>

					<Input
						label="Card Number"
						placeholder="•••• •••• •••• ••••"
						{...register('cardNumber', { 
							required: !initialData && 'Card number is required',
							pattern: {
								value: /^[\d\s•]{13,19}$/,
								message: 'Invalid card number'
							}
						})}
						error={errors.cardNumber?.message}
						disabled={!!initialData}
					/>

					<div className="grid grid-cols-2 gap-4">
						<Input
							label="Expiry Date"
							placeholder="MM/YY"
							{...register('expiry', { 
								required: 'Expiry date is required',
								pattern: {
									value: /^(0[1-9]|1[0-2])\/\d{2}$/,
									message: 'Use MM/YY format'
								}
							})}
						error={errors.expiry?.message}
					/>
					
					<div className="flex items-end pb-2">
						<label className="flex items-center gap-3 cursor-pointer group">
							<div className="relative">
								<input 
									type="checkbox" 
									{...register('isDefault')}
									className="sr-only peer" 
								/>
								<div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
							</div>
							<span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
								Set as default
							</span>
						</label>
					</div>
				</div>

				<div className="flex gap-3 pt-2">
					<Button 
						type="button" 
						variant="ghost" 
						className="flex-1" 
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button 
						type="submit" 
						variant="primary" 
						className="flex-1"
						isLoading={isAdding || isUpdating}
					>
						{initialData ? 'Update Method' : 'Add Payment Method'}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default PaymentMethodForm;
