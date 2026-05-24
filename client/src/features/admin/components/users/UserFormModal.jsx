import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminUserSchema } from '../../../../shared/validation/schemas.js';
import { Modal, Button, Input, Select } from '../../../../shared/ui/index.js';
import { FiEdit2, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const roleOptions = [
	{ value: 'Customer', label: 'Customer' },
	{ value: 'Seller', label: 'Seller' },
	{ value: 'Admin', label: 'Admin' },
];

const statusOptions = [
	{ value: 'active', label: 'Active' },
	{ value: 'suspended', label: 'Suspended' },
];

const UserFormModal = ({ isOpen, onClose, user, onSubmit, isLoading }) => {
	const isEdit = !!user;
	const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
		resolver: zodResolver(adminUserSchema(isEdit)),
		mode: 'onChange',
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
		onSubmit(data);
	};

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title={isEdit ? "Edit User" : "Create New User"}
			size="md"
			footer={
				<>
					<Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
					<Button type="submit" form="user-form" loading={isLoading}>{isEdit ? "Save Changes" : "Create User"}</Button>
				</>
			}
		>
			<form id="user-form" onSubmit={handleSubmit(onInternalSubmit)} className="space-y-5">
				<div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
					<div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-3 border border-indigo-50">
						{isEdit ? <FiEdit2 className="w-7 h-7" /> : <FiUserCheck className="w-7 h-7" />}
					</div>
					<p className="font-bold text-gray-900 text-sm">{isEdit ? `Editing ${user?.firstName}'s profile` : "Fill in the new user's details"}</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<Input label="First Name" placeholder="Jane" {...register('firstName')} error={errors.firstName?.message} />
					<Input label="Last Name" placeholder="Smith" {...register('lastName')} error={errors.lastName?.message} />
				</div>

				<Input label="Email" type="email" placeholder="jane@example.com" {...register('email')} error={errors.email?.message} />
				<Input label="Phone Number" placeholder="+1234567890" {...register('phoneNumber')} error={errors.phoneNumber?.message} />

				<div className="grid grid-cols-2 gap-4">
					<Controller name="role" control={control} render={({ field }) => <Select label="Role" options={roleOptions} {...field} />} />
					<Controller name="status" control={control} render={({ field }) => <Select label="Status" options={statusOptions} {...field} />} />
				</div>

				{!isEdit && (
					<div className="grid grid-cols-2 gap-4">
						<Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
						<Input label="Confirm Password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
					</div>
				)}
			</form>
		</Modal>
	);
};

export default UserFormModal;
