import { useForm } from 'react-hook-form';
import { Input, Button } from '../../../shared/ui/index.js';

const AddressForm = ({ initialData, onSubmit, isLoading, onCancel }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: initialData || {
			label: 'Home',
			recipientName: '',
			phone: '',
			line1: '',
			line2: '',
			city: '',
			state: '',
			postalCode: '',
			country: 'Egypt',
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Address Label (e.g. Home, Work)"
					placeholder="Home"
					{...register('label', { required: 'Label is required' })}
					error={errors.label?.message}
				/>
				<Input
					label="Recipient Name"
					placeholder="John Doe"
					{...register('recipientName', { required: 'Name is required' })}
					error={errors.recipientName?.message}
				/>
			</div>

			<Input
				label="Phone Number"
				placeholder="+20 123 456 7890"
				{...register('phone', { required: 'Phone is required' })}
				error={errors.phone?.message}
			/>

			<Input
				label="Address Line 1"
				placeholder="Street name, Building number"
				{...register('line1', { required: 'Address is required' })}
				error={errors.line1?.message}
			/>

			<Input
				label="Address Line 2 (Optional)"
				placeholder="Apartment, suite, etc."
				{...register('line2')}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="City"
					placeholder="Cairo"
					{...register('city', { required: 'City is required' })}
					error={errors.city?.message}
				/>
				<Input
					label="State / Province"
					placeholder="Cairo Governorate"
					{...register('state')}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Postal Code"
					placeholder="12345"
					{...register('postalCode', { required: 'Postal code is required' })}
					error={errors.postalCode?.message}
				/>
				<Input
					label="Country"
					placeholder="Egypt"
					{...register('country', { required: 'Country is required' })}
					error={errors.country?.message}
				/>
			</div>

			<div className="flex justify-end gap-3 mt-6 pt-4 border-t">
				<Button type="button" variant="ghost" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" variant="primary" isLoading={isLoading}>
					{initialData ? 'Update Address' : 'Save Address'}
				</Button>
			</div>
		</form>
	);
};

export default AddressForm;
