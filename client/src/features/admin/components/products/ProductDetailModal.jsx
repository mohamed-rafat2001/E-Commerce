import { Modal, Badge, Button } from '../../../../shared/ui/index.js';
import { FiImage, FiStar, FiBox, FiLayers, FiGlobe, FiLock, FiUser } from 'react-icons/fi';
import { statusConfig } from './productConstants.js';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
	if (!product) return null;

	const rating = product.ratingAverage || 0;
	const reviewCount = product.ratingCount || 0;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="lg">
			<div className="space-y-6">
				{/* Image Section */}
				<div className="flex flex-col sm:flex-row gap-5">
					<div className="w-full sm:w-48 h-48 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
						{product.coverImage?.secure_url ? (
							<img src={product.coverImage.secure_url} alt={product.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
						) : (
							<div className="w-full h-full flex items-center justify-center text-gray-300">
								<FiImage className="w-12 h-12" />
							</div>
						)}
					</div>
					<div className="flex-1 space-y-3">
						<div>
							<h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
							<div className="flex items-center gap-2 mt-1">
								<Badge variant="secondary" className="text-xs">{product.brand}</Badge>
								<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${statusConfig[product.status]?.color}`}>
									<span className={`w-1.5 h-1.5 rounded-full ${statusConfig[product.status]?.dot}`} />
									{statusConfig[product.status]?.label}
								</span>
							</div>
						</div>
						<p className="text-2xl font-extrabold text-indigo-600">${product.price?.amount?.toFixed(2)} <span className="text-sm font-medium text-gray-400">{product.price?.currency}</span></p>
						<div className="flex items-center gap-4 text-sm text-gray-500">
							<span className="flex items-center gap-1.5"><FiStar className="w-4 h-4 text-amber-400" /> {rating.toFixed(1)} ({reviewCount} reviews)</span>
							<span className="flex items-center gap-1.5"><FiBox className="w-4 h-4" /> {product.countInStock} in stock</span>
						</div>
					</div>
				</div>

				{/* Description */}
				<div>
					<h4 className="text-sm font-bold text-gray-700 mb-2">Description</h4>
					<p className="text-sm text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
						{product.description || 'No description provided.'}
					</p>
				</div>

				{/* Gallery */}
				{product.images?.length > 0 && (
					<div>
						<h4 className="text-sm font-bold text-gray-700 mb-2">Gallery ({product.images.length} images)</h4>
						<div className="flex gap-2 overflow-x-auto pb-2">
							{product.images.map((img, i) => (
								<div key={i} className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
									<img src={img.secure_url} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
								</div>
							))}
						</div>
					</div>
				)}

				{/* Metadata Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
							<FiLayers className="w-3.5 h-3.5 text-indigo-500" />
							{product.category?.name || '—'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Visibility</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
							{product.visibility === 'public' ? <FiGlobe className="w-3.5 h-3.5 text-emerald-500" /> : <FiLock className="w-3.5 h-3.5 text-amber-500" />}
							{product.visibility === 'public' ? 'Public' : 'Private'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Seller</p>
						<p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
							<FiUser className="w-3.5 h-3.5 text-blue-500" />
							{product.userId?.firstName ? `${product.userId.firstName} ${product.userId.lastName || ''}` : product.userId || '—'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Slug</p>
						<p className="text-sm font-semibold text-gray-800 truncate">{product.slug || '—'}</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Created</p>
						<p className="text-sm font-semibold text-gray-800">
							{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Updated</p>
						<p className="text-sm font-semibold text-gray-800">
							{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '—'}
						</p>
					</div>
				</div>

				{/* Reviews Preview */}
				{product.reviews?.length > 0 && (
					<div>
						<h4 className="text-sm font-bold text-gray-700 mb-2">Recent Reviews ({product.reviews.length})</h4>
						<div className="space-y-2 max-h-40 overflow-y-auto">
							{product.reviews.slice(0, 3).map((review, i) => (
								<div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
									<div className="flex items-center gap-0.5">
										{[...Array(5)].map((_, idx) => (
											<FiStar key={idx} className={`w-3 h-3 ${idx < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
										))}
									</div>
									<p className="text-xs text-gray-600 flex-1 line-clamp-2">{review.comment || 'No comment'}</p>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex justify-end pt-4 border-t border-gray-100">
					<Button variant="secondary" onClick={onClose}>Close</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ProductDetailModal;
