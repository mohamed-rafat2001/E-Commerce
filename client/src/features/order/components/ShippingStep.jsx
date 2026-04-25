import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPlus, FiCheck } from 'react-icons/fi';
import { Button, Skeleton, Input } from '../../../shared/ui/index.js';
import useCustomerProfile from '../../customer/hooks/useCustomerProfile.js';
import AddressForm from '../../customer/components/AddressForm.jsx';
import useCustomerAddresses from '../../customer/hooks/useCustomerAddresses.js';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';

/**
 * Shipping step — lets user select a saved address or enter a new one
 */
const ShippingStep = ({ shippingAddress, onSelect, onNext, guestEmail, onGuestEmailChange }) => {
	const { isAuthenticated } = useCurrentUser();
	const { addresses, isLoading } = useCustomerProfile();
	const { addAddress, isAdding } = useCustomerAddresses();
	const [showNewForm, setShowNewForm] = useState(false);
	const [emailError, setEmailError] = useState('');

	useEffect(() => {
		if (!isAuthenticated || (addresses && addresses.length === 0)) {
			setShowNewForm(true);
		}
	}, [isAuthenticated, addresses]);

	const handleSelectAddress = (addr) => {
		onSelect({
			line1: addr.line1,
			line2: addr.line2,
			city: addr.city,
			state: addr.state || '',
			postalCode: addr.postalCode,
			country: addr.country,
			recipientName: addr.recipientName,
			phone: addr.phone,
			_fullAddr: addr,
		});
	};

	const handleNewAddressSubmit = (data) => {
		if (!isAuthenticated) {
			if (!guestEmail) {
				setEmailError('Email is required for guest checkout');
				return;
			}
			setEmailError('');
			onSelect({
				line1: data.line1,
				line2: data.line2,
				city: data.city,
				state: data.state || '',
				postalCode: data.postalCode,
				country: data.country,
				recipientName: data.recipientName,
				phone: data.phone,
				_fullAddr: data,
			});
			onNext(); // Auto-advance for guests after saving
			return;
		}

		addAddress(data, {
			onSuccess: () => {
				setShowNewForm(false);
				// Select the freshly added address
				onSelect({
					line1: data.line1,
					line2: data.line2,
					city: data.city,
					state: data.state || '',
					postalCode: data.postalCode,
					country: data.country,
					recipientName: data.recipientName,
					phone: data.phone,
					_fullAddr: data,
				});
			},
		});
	};

	if (isLoading && isAuthenticated) {
		return (
			<div className="space-y-4">
				<Skeleton variant="image" className="h-28 rounded-2xl" count={2} />
			</div>
		);
	}

	const handleNext = () => {
		if (!isAuthenticated && !guestEmail) {
			setEmailError('Email is required for guest checkout');
			setShowNewForm(true); // force form to show
			return;
		}
		setEmailError('');
		onNext();
	};

	return (
		<motion.div
			className="space-y-6"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 0.3 }}
		>
			<div>
				<h2 className="text-xl font-bold text-gray-900 mb-1">Shipping Address</h2>
				<p className="text-sm text-gray-500">Select a saved address or add a new one.</p>
			</div>

			{/* Saved Addresses */}
			{addresses.length > 0 && (
				<div className="grid grid-cols-1 gap-3">
					{addresses.map((addr) => {
						const isSelected = shippingAddress?._fullAddr?._id === addr._id ||
							(shippingAddress?.street === (addr.line1 + (addr.line2 ? `, ${addr.line2}` : '')) &&
								shippingAddress?.city === addr.city);
						return (
							<motion.button
								key={addr._id}
								type="button"
								onClick={() => handleSelectAddress(addr)}
								className={`relative text-left w-full p-5 rounded-2xl border-2 transition-all duration-300 group
									${isSelected
										? 'border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-100'
										: 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
									}`}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
							>
								{isSelected && (
									<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
										<FiCheck className="w-4 h-4 text-white" />
									</div>
								)}
								<div className="flex items-start gap-3">
									<div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'} transition-colors`}>
										<FiMapPin className="w-5 h-5" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-bold text-gray-900 text-sm">{addr.label || 'Address'}</span>
											{addr.isDefault && (
												<span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full">Default</span>
											)}
										</div>
										{addr.recipientName && <p className="text-sm font-medium text-gray-700">{addr.recipientName}</p>}
										<p className="text-sm text-gray-500">{addr.line1}</p>
										{addr.line2 && <p className="text-sm text-gray-500">{addr.line2}</p>}
										<p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.postalCode}</p>
										<p className="text-sm text-gray-500">{addr.country}</p>
									</div>
								</div>
							</motion.button>
						);
					})}
				</div>
			)}

			{/* Add New Address */}
			<AnimatePresence mode="wait">
				{showNewForm ? (
					<motion.div
						key="form"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
					>
						{!isAuthenticated && (
							<div className="mb-6 pb-6 border-b border-gray-200">
								<h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
								<Input
									label="Email Address"
									type="email"
									placeholder="you@example.com"
									value={guestEmail || ''}
									onChange={(e) => {
										onGuestEmailChange(e.target.value);
										if (e.target.value) setEmailError('');
									}}
									error={emailError}
									required
								/>
							</div>
						)}
						<h3 className="font-bold text-gray-900 mb-4">Shipping Address</h3>
						<AddressForm
							onSubmit={handleNewAddressSubmit}
							isLoading={isAuthenticated ? isAdding : false}
							onCancel={() => isAuthenticated ? setShowNewForm(false) : null}
						/>
					</motion.div>
				) : (
					<motion.div key="button">
						<Button
							variant="outline"
							fullWidth
							onClick={() => setShowNewForm(true)}
							className="border-dashed border-2 border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 py-4 rounded-2xl"
						>
							<FiPlus className="w-5 h-5 mr-2" />
							Add a New Address
						</Button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Continue Button (Only shown when selecting saved addresses) */}
			{!showNewForm && (
				<div className="flex justify-end pt-2">
					<Button
						variant="primary"
						size="lg"
						onClick={handleNext}
						disabled={!shippingAddress}
						className="px-10 min-w-[200px]"
					>
						{shippingAddress ? (
							<span className="flex items-center gap-2">
								<FiCheck className="w-5 h-5" />
								Address Saved — Next
							</span>
						) : (
							'Continue to Payment'
						)}
					</Button>
				</div>
			)}
		</motion.div>
	);
};

export default ShippingStep;
