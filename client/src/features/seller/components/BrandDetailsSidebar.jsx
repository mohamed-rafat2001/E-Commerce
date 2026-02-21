import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner, Badge } from '../../../shared/ui/index.js';
import useToast from '../../../shared/hooks/useToast.js';
import { FiX, FiPackage, FiTag, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const BrandDetailsSidebar = ({ brand, isOpen, onClose }) => {
	const [subCategories, setSubCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [expandedSections, setExpandedSections] = useState({
		subcategories: true,
		products: true
	});
	const { showError } = useToast();

	useEffect(() => {
		const fetchBrandDetails = async () => {
			if (!brand?._id) return;
			
			setLoading(true);
			try {
				// Fetch subcategories for this brand
				const subCatResponse = await fetch(`/api/v1/subcategories/brand/${brand._id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				});
				
				if (subCatResponse.ok) {
					const subCatData = await subCatResponse.json();
					setSubCategories(subCatData.data || []);
				} else {
					showError('Failed to load subcategories');
				}
				
				// Fetch products for this brand
				const productsResponse = await fetch(`/api/v1/products/brand/${brand._id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				});
				
				if (productsResponse.ok) {
					const productsData = await productsResponse.json();
					setProducts(productsData.data || []);
				} else {
					showError('Failed to load products');
				}
			} catch (error) {
				console.error('Error fetching brand details:', error);
				showError('Failed to load brand details');
			} finally {
				setLoading(false);
			}
		};

		if (brand && isOpen) {
			fetchBrandDetails();
		}
	}, [brand, isOpen, showError]);

	const toggleSection = (section) => {
		setExpandedSections(prev => ({
			...prev,
			[section]: !prev[section]
		}));
	};

	if (!brand || !isOpen) return null;

	return (
		<motion.div
			initial={{ x: '100%' }}
			animate={{ x: 0 }}
			exit={{ x: '100%' }}
			transition={{ type: 'spring', damping: 25, stiffness: 200 }}
			className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col"
		>
			{/* Header */}
			<div className="flex items-center justify-between p-6 border-b border-gray-200">
				<div>
					<h2 className="text-xl font-bold text-gray-900">Brand Details</h2>
					<p className="text-sm text-gray-500 mt-1">{brand.name}</p>
				</div>
				<button
					onClick={onClose}
					className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
				>
					<FiX className="w-5 h-5 text-gray-500" />
				</button>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto">
				{loading ? (
					<div className="flex justify-center items-center py-12">
						<LoadingSpinner />
					</div>
				) : (
					<div className="p-6 space-y-6">
						{/* Brand Info */}
						<div className="bg-gray-50 rounded-xl p-4">
							<h3 className="font-semibold text-gray-900 mb-2">Brand Information</h3>
							<div className="space-y-2 text-sm">
								<div>
									<span className="text-gray-500">Status:</span>
									<Badge variant={brand.isActive ? "success" : "secondary"} size="sm" className="ml-2">
										{brand.isActive ? "Active" : "Inactive"}
									</Badge>
								</div>
								{brand.website && (
									<div>
										<span className="text-gray-500">Website:</span>
										<a 
											href={brand.website} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-indigo-600 hover:underline ml-2"
										>
											{brand.website}
										</a>
									</div>
								)}
								<div>
									<span className="text-gray-500">Products:</span>
									<span className="ml-2 font-medium">{products.length}</span>
								</div>
							</div>
						</div>

						{/* Subcategories Section */}
						<div className="border border-gray-200 rounded-xl overflow-hidden">
							<button
								onClick={() => toggleSection('subcategories')}
								className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-center gap-2">
									<FiTag className="w-4 h-4 text-gray-500" />
									<span className="font-semibold text-gray-900">Subcategories</span>
									<Badge variant="secondary" size="sm">
										{subCategories.length}
									</Badge>
								</div>
								{expandedSections.subcategories ? (
									<FiChevronUp className="w-4 h-4 text-gray-500" />
								) : (
									<FiChevronDown className="w-4 h-4 text-gray-500" />
								)}
							</button>
							
							{expandedSections.subcategories && (
								<div className="p-4 border-t border-gray-200">
									{subCategories.length > 0 ? (
										<div className="space-y-2">
											{subCategories.map((subCat) => (
												<div 
													key={subCat._id} 
													className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
												>
													<div>
														<h4 className="font-medium text-gray-900">{subCat.name}</h4>
														{subCat.categoryId && (
															<p className="text-xs text-gray-500 mt-1">
																Category: {subCat.categoryId.name}
															</p>
														)}
													</div>
													<Badge variant={subCat.isActive ? "success" : "secondary"} size="sm">
														{subCat.isActive ? "Active" : "Inactive"}
													</Badge>
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-500 text-center py-4">No subcategories found</p>
									)}
								</div>
							)}
						</div>

						{/* Products Section */}
						<div className="border border-gray-200 rounded-xl overflow-hidden">
							<button
								onClick={() => toggleSection('products')}
								className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-center gap-2">
									<FiPackage className="w-4 h-4 text-gray-500" />
									<span className="font-semibold text-gray-900">Products</span>
									<Badge variant="secondary" size="sm">
										{products.length}
									</Badge>
								</div>
								{expandedSections.products ? (
									<FiChevronUp className="w-4 h-4 text-gray-500" />
								) : (
									<FiChevronDown className="w-4 h-4 text-gray-500" />
								)}
							</button>
							
							{expandedSections.products && (
								<div className="p-4 border-t border-gray-200">
									{products.length > 0 ? (
										<div className="space-y-3">
											{products.slice(0, 5).map((product) => (
												<div 
													key={product._id} 
													className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
												>
													{product.images?.[0]?.secure_url ? (
														<img 
															src={product.images[0].secure_url} 
															alt={product.name}
															className="w-12 h-12 rounded-lg object-cover"
															crossOrigin="anonymous"
														/>
													) : (
														<div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
															<FiPackage className="w-6 h-6 text-gray-400" />
														</div>
													)}
													<div className="flex-1 min-w-0">
														<h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
														<p className="text-sm text-gray-500 truncate">
															{product.price?.amount} {product.price?.currency}
														</p>
													</div>
													<Badge variant={product.isActive ? "success" : "secondary"} size="sm">
														{product.isActive ? "Active" : "Inactive"}
													</Badge>
												</div>
											))}
											{products.length > 5 && (
												<p className="text-center text-sm text-gray-500 pt-2">
													+{products.length - 5} more products
												</p>
											)}
										</div>
									) : (
										<p className="text-gray-500 text-center py-4">No products found</p>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default BrandDetailsSidebar;