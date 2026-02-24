import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal } from '../../../../shared/ui/index.js';

const CoverImageEditModal = ({ isOpen, onClose, onUpload, brand, isUploading }) => {
	const fileInputRef = useRef(null);
	const [progress, setProgress] = useState(0);
	
	useEffect(() => {
		let interval;
		if (isUploading) {
			setProgress(0);
			interval = setInterval(() => {
				setProgress(prev => {
					if (prev >= 90) return 90;
					return prev + 5;
				});
			}, 200);
		} else {
			setProgress(0);
		}
		return () => clearInterval(interval);
	}, [isUploading]);

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
		<Modal isOpen={isOpen} onClose={onClose} title="Update Brand Cover Image" size="lg">
			<div className="space-y-4">
				<div className="text-center">
					{brand?.coverImage?.secure_url ? (
						<div className="w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 mx-auto mb-4 relative">
                            <img 
                                src={brand.coverImage.secure_url} 
                                alt={brand.name} 
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        </div>
					) : (
						<div className="w-full h-48 rounded-xl bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center text-white text-xl font-medium mx-auto mb-4 border-2 border-gray-200">
							No Cover Image
						</div>
					)}
					<p className="text-sm text-gray-600">Current cover image</p>
				</div>
				
				{isUploading && (
					<div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
						<div 
							className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
							style={{ width: `${progress}%` }}
						></div>
						<p className="text-xs text-center mt-1 text-gray-500">Uploading... {progress}%</p>
					</div>
				)}

				<div className="flex gap-3 justify-center">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept="image/*"
						className="hidden"
					/>
					<div className="w-full max-w-xs flex gap-3">
                        <Button 
                            variant="secondary" 
                            fullWidth
                            onClick={() => fileInputRef.current?.click()}
                            loading={isUploading}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Choose New Cover'}
                        </Button>
                        <Button 
                            variant="secondary" 
                            fullWidth
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
				</div>
				<p className="text-xs text-gray-500 text-center">Maximum file size: 5MB. Recommended size: 1200x400px</p>
			</div>
		</Modal>
	);
};

export default CoverImageEditModal;
