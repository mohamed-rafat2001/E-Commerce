import { useState } from 'react';
import { Button, Modal, Input, Select } from '../../../shared/ui/index.js';
import { FiImage } from 'react-icons/fi';

const statusOptions = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'archived', label: 'Archived' },
];

const ProductFormModal = ({ isOpen, onClose, product = null, onSubmit, isLoading }) => {
	const isEditing = !!product;
	const [formData, setFormData] = useState({
		name: product?.name || '',
		description: product?.description || '',
		price: product?.price?.amount || '',
		brand: product?.brand || '',
		category: product?.category?._id || '',
		countInStock: product?.countInStock || 0,
		status: product?.status || 'draft',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name, value) => {
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({
			...formData,
			price: { amount: parseFloat(formData.price), currency: 'USD' },
		});
	};

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title={isEditing ? 'Edit Product' : 'Add New Product'}
			size="md"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
					<Input
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Enter product name"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Enter product description"
						rows={3}
						className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
						<Input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleChange}
							placeholder="0.00"
							min="0"
							step="0.01"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
						<Input
							type="number"
							name="countInStock"
							value={formData.countInStock}
							onChange={handleChange}
							placeholder="0"
							min="0"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
					<Input
						name="brand"
						value={formData.brand}
						onChange={handleChange}
						placeholder="Enter brand name"
						required
					/>
				</div>

				<Select
					label="Product Status"
					value={formData.status}
					onChange={(val) => handleSelectChange('status', val)}
					options={statusOptions}
				/>

				<div className="flex gap-3 pt-4">
					<Button variant="secondary" type="button" onClick={onClose} fullWidth>
						Cancel
					</Button>
					<Button type="submit" loading={isLoading} fullWidth>
						{isEditing ? 'Update Product' : 'Add Product'}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default ProductFormModal;
