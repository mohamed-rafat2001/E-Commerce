import React, { useRef } from 'react';
import { Button, Modal } from '../../../../shared/ui/index.js';

const LogoEditModal = ({ isOpen, onClose, onUpload, brand, isUploading }) => {
	const fileInputRef = useRef(null);
	
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		
		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}
		
		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			alert('Image size must be less than 5MB');
			return;
		}
		
		onUpload(file, brand._id);
	};
	
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Update Brand Logo" size="sm">
			<div className="space-y-4">
				<div className="text-center">
					{brand?.logo?.secure_url ? (
						<img 
							src={brand.logo.secure_url} 
							alt={brand.name} 
							className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 mx-auto mb-4"
							crossOrigin="anonymous"
						/>
					) : (
						<div className="w-24 h-24 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
							{brand?.name?.[0]?.toUpperCase() || 'B'}
						</div>
					)}
					<p className="text-sm text-gray-600">Current logo</p>
				</div>
				
				<div className="flex gap-3">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept="image/*"
						className="hidden"
					/>
					<Button 
						variant="secondary" 
						fullWidth
						onClick={() => fileInputRef.current?.click()}
						loading={isUploading}
						disabled={isUploading}
					>
						{isUploading ? 'Uploading...' : 'Choose New Logo'}
					</Button>
					<Button 
						variant="secondary" 
						fullWidth
						onClick={onClose}
					>
						Cancel
					</Button>
				</div>
				<p className="text-xs text-gray-500 text-center">Maximum file size: 5MB. Supported formats: JPG, PNG, WebP</p>
			</div>
		</Modal>
	);
};

export default LogoEditModal;
