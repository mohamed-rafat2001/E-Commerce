import { toast } from 'react-hot-toast';

const useToast = () => {
	const showSuccess = (message) => {
		toast.success(message, {
			icon: '✅',
			style: {
				background: 'rgba(255, 255, 255, 0.95)',
				backdropFilter: 'blur(12px)',
				color: '#059669',
				padding: '12px 16px',
				borderRadius: '20px',
				boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 10px 20px -10px rgba(0, 0, 0, 0.05)',
				border: '1px solid rgba(255, 255, 255, 0.5)',
				maxWidth: '400px',
			}
		});
	};

	const showError = (message) => {
		toast.error(message, {
			icon: '❌',
			style: {
				background: 'rgba(255, 255, 255, 0.95)',
				backdropFilter: 'blur(12px)',
				color: '#dc2626',
				padding: '12px 16px',
				borderRadius: '20px',
				boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 10px 20px -10px rgba(0, 0, 0, 0.05)',
				border: '1px solid rgba(255, 255, 255, 0.5)',
				maxWidth: '400px',
			}
		});
	};

	const showInfo = (message) => {
		toast(message, {
			icon: 'ℹ️',
			style: {
				background: 'rgba(255, 255, 255, 0.95)',
				backdropFilter: 'blur(12px)',
				color: '#3b82f6',
				padding: '12px 16px',
				borderRadius: '20px',
				boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 10px 20px -10px rgba(0, 0, 0, 0.05)',
				border: '1px solid rgba(255, 255, 255, 0.5)',
				maxWidth: '400px',
			}
		});
	};

	const showLoading = (message) => {
		return toast.loading(message, {
			icon: '⏳',
			style: {
				background: 'rgba(255, 255, 255, 0.95)',
				backdropFilter: 'blur(12px)',
				color: '#6b7280',
				padding: '12px 16px',
				borderRadius: '20px',
				boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 10px 20px -10px rgba(0, 0, 0, 0.05)',
				border: '1px solid rgba(255, 255, 255, 0.5)',
				maxWidth: '400px',
			}
		});
	};

	const dismiss = (toastId) => {
		toast.dismiss(toastId);
	};

	return {
		showSuccess,
		showError,
		showInfo,
		showLoading,
		dismiss
	};
};

export default useToast;