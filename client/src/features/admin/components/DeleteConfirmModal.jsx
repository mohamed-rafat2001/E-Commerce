import { Button, Modal } from '../../../shared/ui/index.js';
import { FiAlertTriangle } from 'react-icons/fi';

const DeleteConfirmModal = ({ isOpen, onClose, title = 'Delete Confirmation', entityName, description, onConfirm, isLoading }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
			<div className="text-center space-y-6">
				<div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
					<FiAlertTriangle className="w-10 h-10" />
				</div>
				<div className="space-y-2">
					<h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
					<p className="text-gray-500 text-sm leading-relaxed px-4">
						You are about to delete <span className="font-bold text-gray-900">"{entityName}"</span>.
						{description || ' This action cannot be undone.'}
					</p>
				</div>
				<div className="flex gap-3 pt-4">
					<Button variant="secondary" onClick={onClose} fullWidth disabled={isLoading}>
						Cancel
					</Button>
					<Button 
						variant="primary" 
						className="bg-rose-500 hover:bg-rose-600 border-rose-600 shadow-rose-200"
						onClick={onConfirm} 
						fullWidth 
						loading={isLoading}
					>
						Yes, Delete
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteConfirmModal;
