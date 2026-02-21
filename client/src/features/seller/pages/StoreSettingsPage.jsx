import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Select, LoadingSpinner, Badge, Modal } from '../../../shared/ui/index.js';
import { 
	FiSave, FiPlus, FiMapPin, FiCreditCard, FiEdit2, FiMail, 
	FiPhone, FiGlobe, FiShield, FiImage, FiCheck, FiX, FiAlertTriangle,
	FiUser, FiBriefcase, FiHash, FiCamera, FiTrash2
} from 'react-icons/fi';
import { useSellerProfile, useUpdateSellerProfile, useAddSellerAddress, useAddPayoutMethod } from '../hooks/index.js';
import useCategories from '../../category/hooks/useCategories.js';

// Section wrapper
const SettingsSection = ({ title, subtitle, icon: Icon, children, gradient = 'from-indigo-500 to-purple-600' }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
	>
		<div className="p-6 border-b border-gray-50">
			<div className="flex items-center gap-3">
				<div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
					<Icon className="w-5 h-5 text-white" />
				</div>
				<div>
					<h3 className="font-bold text-gray-900">{title}</h3>
					<p className="text-sm text-gray-500">{subtitle}</p>
				</div>
			</div>
		</div>
		<div className="p-6">{children}</div>
	</motion.div>
);

// Address Card
const AddressCard = ({ address, index }) => (
	<div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
		<div className="flex items-start justify-between mb-2">
			<span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider">
				{address.label || `Address ${index + 1}`}
			</span>
		</div>
		<p className="text-sm text-gray-700 font-medium">{address.line1}</p>
		{address.line2 && <p className="text-sm text-gray-500">{address.line2}</p>}
		<p className="text-sm text-gray-500">{address.city}, {address.postalCode}</p>
		<p className="text-sm text-gray-500">{address.country}</p>
	</div>
);

// Payout Method Card
const PayoutCard = ({ method, index }) => (
	<div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
		<div className="flex items-center justify-between mb-3">
			<div className="flex items-center gap-2">
				<div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
					method.type === 'bank_transfer' ? 'bg-blue-50 text-blue-500' :
					method.type === 'paypal' ? 'bg-indigo-50 text-indigo-500' :
					method.type === 'stripe' ? 'bg-purple-50 text-purple-500' :
					'bg-emerald-50 text-emerald-500'
				}`}>
					<FiCreditCard className="w-4 h-4" />
				</div>
				<span className="text-xs font-bold uppercase tracking-wider text-gray-500">
					{method.type?.replace('_', ' ')}
				</span>
			</div>
			{method.isDefault && (
				<Badge variant="success" size="sm">Default</Badge>
			)}
		</div>
		<p className="text-sm font-bold text-gray-900">{method.accountHolderName}</p>
		<p className="text-sm text-gray-500">{method.bankName}</p>
		<p className="text-xs text-gray-400 font-mono mt-1">
			****{method.accountNumber?.slice(-4)}
		</p>
	</div>
);

// Add Address Modal
const AddAddressModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
	const [formData, setFormData] = useState({
		label: '', line1: '', line2: '', city: '', postalCode: '', country: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({ label: '', line1: '', line2: '', city: '', postalCode: '', country: '' });
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Add Business Address" size="md">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
					<Input name="label" value={formData.label} onChange={handleChange} placeholder="e.g. Headquarters, Warehouse" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
					<Input name="line1" value={formData.line1} onChange={handleChange} placeholder="Street address" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
					<Input name="line2" value={formData.line2} onChange={handleChange} placeholder="Apt, Suite, Unit (optional)" />
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">City</label>
						<Input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
						<Input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="12345" required />
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
					<Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
				</div>
				<div className="flex gap-3 pt-4">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>Cancel</Button>
					<Button type="submit" loading={isLoading} fullWidth>Add Address</Button>
				</div>
			</form>
		</Modal>
	);
};

// Add Payout Method Modal
const AddPayoutModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
	const [formData, setFormData] = useState({
		type: 'bank_transfer',
		accountHolderName: '',
		accountNumber: '',
		bankName: '',
		routingNumber: '',
		notes: '',
		isDefault: false,
	});

	const handleChange = (e) => {
		const { name, value, type: inputType, checked } = e.target;
		setFormData(prev => ({ ...prev, [name]: inputType === 'checkbox' ? checked : value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({
			type: 'bank_transfer', accountHolderName: '', accountNumber: '',
			bankName: '', routingNumber: '', notes: '', isDefault: false,
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Add Payout Method" size="md">
			<form onSubmit={handleSubmit} className="space-y-4">
				<Select
					label="Payout Type"
					value={formData.type}
					onChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
					options={[
						{ value: 'bank_transfer', label: 'Bank Transfer' },
						{ value: 'paypal', label: 'PayPal' },
						{ value: 'stripe', label: 'Stripe' },
						{ value: 'cash', label: 'Cash' },
					]}
				/>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
					<Input name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="Full name on account" required />
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
						<Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account number" required />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
						<Input name="routingNumber" value={formData.routingNumber} onChange={handleChange} placeholder="Routing number" required />
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
					<Input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank name" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
					<textarea
						name="notes"
						value={formData.notes}
						onChange={handleChange}
						placeholder="Additional notes..."
						rows={2}
						className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
					/>
				</div>
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						name="isDefault"
						checked={formData.isDefault}
						onChange={handleChange}
						className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
					/>
					<span className="text-sm text-gray-700">Set as default payout method</span>
				</label>
				<div className="flex gap-3 pt-4">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>Cancel</Button>
					<Button type="submit" loading={isLoading} fullWidth>Add Payout Method</Button>
				</div>
			</form>
		</Modal>
	);
};

const StoreSettingsPage = () => {
	const { profile, isLoading: profileLoading, refetch } = useSellerProfile();
	const { updateProfile, isUpdating } = useUpdateSellerProfile();
	const { addAddress, isAdding: isAddingAddress } = useAddSellerAddress();
	const { addPayoutMethod, isAdding: isAddingPayout } = useAddPayoutMethod();
	const { categories } = useCategories();

	const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
	const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
	const [isEditingProfile, setIsEditingProfile] = useState(false);

	const [profileForm, setProfileForm] = useState({
		businessEmail: '', businessPhone: ''
	});

	const startEditProfile = () => {
		setProfileForm({
			businessEmail: profile?.businessEmail || '',
			businessPhone: profile?.businessPhone || '',
		});
		setIsEditingProfile(true);
	};

	const handleProfileChange = (e) => {
		const { name, value } = e.target;
		setProfileForm(prev => ({ ...prev, [name]: value }));
	};

	const handleProfileSubmit = (e) => {
		e.preventDefault();
		updateProfile(profileForm, {
			onSuccess: () => {
				setIsEditingProfile(false);
				refetch();
			}
		});
	};

	const handleAddAddress = (data) => {
		addAddress(data, {
			onSuccess: () => {
				setIsAddressModalOpen(false);
				refetch();
			}
		});
	};

	const handleAddPayout = (data) => {
		addPayoutMethod(data, {
			onSuccess: () => {
				setIsPayoutModalOpen(false);
				refetch();
			}
		});
	};

	if (profileLoading) {
		return (
			<div className="flex justify-center items-center py-20">
				<LoadingSpinner />
			</div>
		);
	}

	const verificationColors = {
		verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		in_review: 'bg-amber-50 text-amber-700 border-amber-200',
		unverified: 'bg-gray-50 text-gray-700 border-gray-200',
		rejected: 'bg-rose-50 text-rose-700 border-rose-200',
	};

	const verificationIcons = {
		verified: FiCheck,
		in_review: FiAlertTriangle,
		unverified: FiShield,
		rejected: FiX,
	};

	const VerifIcon = verificationIcons[profile?.verificationStatus] || FiShield;

	return (
		<div className="space-y-6 pb-10">
			{/* Page Header */}
			<motion.div 
				initial={{ opacity: 0, y: -20 }} 
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
			>
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Store Settings ⚙️</h1>
					<p className="text-gray-500 font-medium mt-1">Manage your store profile, addresses, and payout methods.</p>
				</div>
				<div className="flex items-center gap-3">
					<span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${verificationColors[profile?.verificationStatus]}`}>
						<VerifIcon className="w-4 h-4" />
						{profile?.verificationStatus?.replace('_', ' ') || 'Unverified'}
					</span>
					<span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border ${
						profile?.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
						profile?.status === 'suspended' ? 'bg-rose-50 text-rose-700 border-rose-200' :
						'bg-gray-50 text-gray-600 border-gray-200'
					}`}>
						<span className={`w-2 h-2 rounded-full ${
							profile?.status === 'active' ? 'bg-emerald-500' :
							profile?.status === 'suspended' ? 'bg-rose-500' : 'bg-gray-400'
						}`}></span>
						{profile?.status || 'Active'}
					</span>
				</div>
			</motion.div>

			{/* Business Information Section */}
			<SettingsSection
				title="Business Information"
				subtitle="Your store's business details"
				icon={FiBriefcase}
				gradient="from-violet-500 to-purple-600"
			>
				{isEditingProfile ? (
					<form onSubmit={handleProfileSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
								<Input type="email" name="businessEmail" value={profileForm.businessEmail} onChange={handleProfileChange} placeholder="contact@business.com" required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
								<Input name="businessPhone" value={profileForm.businessPhone} onChange={handleProfileChange} placeholder="+1 234 567 890" required />
							</div>
						</div>
						<div className="flex gap-3 pt-2">
							<Button variant="secondary" type="button" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
							<Button type="submit" loading={isUpdating} icon={<FiSave className="w-4 h-4" />}>Save Changes</Button>
						</div>
					</form>
				) : (
					<div className="space-y-4">
						<div className="flex flex-wrap gap-6 text-sm text-gray-600">
							<span className="flex items-center gap-2">
								<FiMail className="w-4 h-4 text-gray-400" />
								{profile?.businessEmail || 'Not set'}
							</span>
							<span className="flex items-center gap-2">
								<FiPhone className="w-4 h-4 text-gray-400" />
								{profile?.businessPhone || 'Not set'}
							</span>
						</div>
						<Button 
							variant="secondary" 
							size="sm" 
							onClick={startEditProfile}
							icon={<FiEdit2 className="w-4 h-4" />}
						>
							Edit Business Info
						</Button>
					</div>
				)}
			</SettingsSection>

			{/* Business Addresses */}
			<SettingsSection
				title="Business Addresses"
				subtitle="Manage your warehouse and office locations"
				icon={FiMapPin}
				gradient="from-emerald-500 to-teal-600"
			>
				{profile?.addresses?.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						{profile.addresses.map((addr, i) => (
							<AddressCard key={i} address={addr} index={i} />
						))}
					</div>
				) : (
					<div className="text-center py-8 mb-4">
						<FiMapPin className="w-12 h-12 mx-auto text-gray-200 mb-3" />
						<p className="text-gray-500 text-sm">No addresses added yet</p>
					</div>
				)}
				<Button 
					variant="secondary" 
					size="sm" 
					onClick={() => setIsAddressModalOpen(true)}
					icon={<FiPlus className="w-4 h-4" />}
				>
					Add Address
				</Button>
			</SettingsSection>

			{/* Payout Methods */}
			<SettingsSection
				title="Payout Methods"
				subtitle="How you receive your earnings"
				icon={FiCreditCard}
				gradient="from-blue-500 to-indigo-600"
			>
				{profile?.payoutMethods?.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						{profile.payoutMethods.map((method, i) => (
							<PayoutCard key={i} method={method} index={i} />
						))}
					</div>
				) : (
					<div className="text-center py-8 mb-4">
						<FiCreditCard className="w-12 h-12 mx-auto text-gray-200 mb-3" />
						<p className="text-gray-500 text-sm">No payout methods added yet</p>
					</div>
				)}
				<Button 
					variant="secondary" 
					size="sm" 
					onClick={() => setIsPayoutModalOpen(true)}
					icon={<FiPlus className="w-4 h-4" />}
				>
					Add Payout Method
				</Button>
			</SettingsSection>

			{/* Balance */}
			{profile?.balance && (
				<SettingsSection
					title="Account Balance"
					subtitle="Your current available balance"
					icon={FiHash}
					gradient="from-rose-500 to-pink-600"
				>
					<div className="flex items-center gap-4">
						<div className="text-4xl font-black text-gray-900">
							${profile.balance.amount?.toFixed(2) || '0.00'}
						</div>
						<span className="text-sm text-gray-500 font-medium uppercase tracking-wider">
							{profile.balance.currency || 'USD'}
						</span>
					</div>
				</SettingsSection>
			)}

			{/* Modals */}
			<AddAddressModal
				isOpen={isAddressModalOpen}
				onClose={() => setIsAddressModalOpen(false)}
				onSubmit={handleAddAddress}
				isLoading={isAddingAddress}
			/>
			<AddPayoutModal
				isOpen={isPayoutModalOpen}
				onClose={() => setIsPayoutModalOpen(false)}
				onSubmit={handleAddPayout}
				isLoading={isAddingPayout}
			/>
		</div>
	);
};

export default StoreSettingsPage;
