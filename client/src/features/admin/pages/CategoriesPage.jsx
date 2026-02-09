import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	PlusIcon, 
	SearchIcon, 
	FilterIcon,
	EditIcon, 
	TrashIcon 
} from '../../../shared/constants/icons.jsx';
import { Button, Modal, Input, LoadingSpinner } from '../../../shared/ui/index.js';
import { toast } from 'react-hot-toast';

// Mock data for categories (replace with real API hook later)
const mockCategories = [
	{ _id: '1', name: 'Electronics', slug: 'electronics', count: 120, status: 'active' },
	{ _id: '2', name: 'Clothing', slug: 'clothing', count: 85, status: 'active' },
	{ _id: '3', name: 'Books', slug: 'books', count: 45, status: 'active' },
	{ _id: '4', name: 'Home & Garden', slug: 'home-garden', count: 60, status: 'active' },
];

const CategoryModal = ({ isOpen, onClose, category, onSubmit, isLoading }) => {
	const [formData, setFormData] = useState({
		name: category?.name || '',
		image: null
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={category ? "Edit Category" : "Add Category"}
			size="md"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
					<Input
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="e.g. Electronics"
						required
					/>
				</div>
				
				<div className="flex justify-end gap-3 pt-4">
					<Button variant="secondary" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" loading={isLoading}>
						{category ? "Update Category" : "Create Category"}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

const CategoriesPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [categories, setCategories] = useState(mockCategories);

	const filteredCategories = categories.filter(cat => 
		cat.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleAdd = () => {
		setEditingCategory(null);
		setIsModalOpen(true);
	};

	const handleEdit = (category) => {
		setEditingCategory(category);
		setIsModalOpen(true);
	};

	const handleDelete = (id) => {
		if(window.confirm('Delete this category?')) {
			setCategories(categories.filter(c => c._id !== id));
			toast.success('Category deleted');
		}
	};

	const handleSubmit = (data) => {
		// Mock submission
		if(editingCategory) {
			setCategories(categories.map(c => c._id === editingCategory._id ? { ...c, ...data } : c));
			toast.success('Category updated');
		} else {
			setCategories([...categories, { _id: Date.now().toString(), ...data, count: 0, status: 'active' }]);
			toast.success('Category created');
		}
		setIsModalOpen(false);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Categories 📂</h1>
					<p className="text-gray-500 text-sm mt-1">Manage product categories</p>
				</div>
				<Button onClick={handleAdd}>
					<PlusIcon className="w-5 h-5 mr-2" />
					Add Category
				</Button>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
				<div className="relative flex-1 max-w-md">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Search categories..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
					/>
				</div>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<AnimatePresence mode="popLayout">
					{filteredCategories.map((category) => (
						<motion.div
							key={category._id}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow group relative overflow-hidden"
						>
							<div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
								<button 
									onClick={() => handleEdit(category)}
									className="p-2 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded-lg transition-colors"
								>
									<EditIcon className="w-4 h-4" />
								</button>
								<button 
									onClick={() => handleDelete(category._id)}
									className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
								>
									<TrashIcon className="w-4 h-4" />
								</button>
							</div>

							<div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
								<span className="text-xl font-bold">{category.name[0]}</span>
							</div>
							
							<h3 className="font-semibold text-gray-900 text-lg mb-1">{category.name}</h3>
							<p className="text-gray-500 text-sm">{category.count} Products</p>
							
							<div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${
									category.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
								}`}>
									{category.status}
								</span>
								<span className="text-gray-400">ID: {category._id}</span>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{isModalOpen && (
				<CategoryModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					category={editingCategory}
					onSubmit={handleSubmit}
				/>
			)}
		</div>
	);
};

export default CategoriesPage;
