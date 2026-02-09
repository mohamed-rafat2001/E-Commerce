import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal, Button, Input, Select } from '../../../../shared/ui/index.js';
import { FiEdit2, FiUserCheck } from 'react-icons/fi';
import { roleOptions, statusOptions } from './userConstants.js';
import toast from 'react-hot-toast';

const UserFormModal = ({ isOpen, onClose, user, onSubmit, isLoading }) => {
	const isEdit = !!user;
	const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			role: 'Customer',
			status: 'active',
			password: '',
			confirmPassword: '',
		}
	});

	useEffect(() => {
		if (isOpen) {
			reset({
				firstName: user?.firstName || '',
				lastName: user?.lastName || '',
				email: user?.email || '',
				phoneNumber: user?.phoneNumber || '',
				role: user?.role || 'Customer',
				status: user?.status || 'active',
				password: '',
				confirmPassword: '',
			});
		}
	}, [isOpen, user, reset]);

	const onInternalSubmit = (data) => {
		if (isEdit && !data.password) {
			delete data.password;
			delete data.confirmPassword;
		}
		if (!isEdit && data.password !== data.confirmPassword) {
			return toast.error("Passwords do not match");
		}
		onSubmit(data);
	};

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title={isEdit ? "Edit User" : "Create New User"}
			size="md"
		>
			<form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-5">
				<div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
					<div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-3 border border-indigo-50">
						{isEdit ? <FiEdit2 className="w-7 h-7" /> : <FiUserCheck className="w-7 h-7" />}
					</div>
					<p className="font-bold text-gray-900 text-sm">{isEdit ? `Editing ${user?.firstName}'s profile` : "Fill in the new user's details"}</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<Input label="First Name" placeholder="Jane" {...register('firstName', { required: 'First name is required' })} error={errors.firstName?.message} />
					<Input label="Last Name" placeholder="Smith" {...register('lastName', { required: 'Last name is required' })} error={errors.lastName?.message} />
				</div>

				<Input label="Email" type="email" placeholder="jane@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
				<Input label="Phone Number" placeholder="+1234567890" {...register('phoneNumber', { required: 'Phone number is required' })} error={errors.phoneNumber?.message} />

				<div className="grid grid-cols-2 gap-4">
					<Controller name="role" control={control} render={({ field }) => <Select label="Role" options={roleOptions} {...field} />} />
					<Controller name="status" control={control} render={({ field }) => <Select label="Status" options={statusOptions} {...field} />} />
				</div>

				{!isEdit && (
					<div className="grid grid-cols-2 gap-4">
						<Input label="Password" type="password" placeholder="••••••••" {...register('password', { required: !isEdit ? 'Password is required' : false })} error={errors.password?.message} />
						<Input label="Confirm Password" type="password" placeholder="••••••••" {...register('confirmPassword', { required: !isEdit ? 'Confirmation is required' : false })} error={errors.confirmPassword?.message} />
					</div>
				)}

				<div className="flex gap-3 pt-4 border-t border-gray-100">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>Cancel</Button>
					<Button type="submit" loading={isLoading} fullWidth>{isEdit ? "Save Changes" : "Create User"}</Button>
				</div>
			</form>
		</Modal>
	);
};

export default UserFormModal;
