import { motion } from 'framer-motion';
import { Modal, Button } from '../../../shared/ui/index.js';
import { TrashIcon } from '../../../shared/constants/icons.jsx';

const PersonalDetailsModals = ({
    // Upload modal
    isUploadModalOpen, setIsUploadModalOpen,
    previewUrl, isUploadingAvatar, uploadProgress,
    fileInputRef, handleFileChange, handleUploadAvatar,
    selectedFile, clearFileSelection,
    // Delete avatar modal
    isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteAvatar,
    // Account delete modal
    isAccountDeleteModalOpen, setIsAccountDeleteModalOpen,
    handleAccountDeletion, isDeletingAccount,
}) => (
    <>
        {/* Upload Image Modal */}
        <Modal isOpen={isUploadModalOpen} onClose={() => { if (!isUploadingAvatar) { setIsUploadModalOpen(false); clearFileSelection(); } }} title="Upload Profile Image" size="sm">
            <div className="space-y-6">
                <div className={`relative aspect-square rounded-3xl overflow-hidden border-2 border-dashed ${previewUrl ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40'} flex flex-col items-center justify-center transition-all duration-300`}>
                    {previewUrl ? (
                        <>
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            {!isUploadingAvatar && (
                                <button onClick={clearFileSelection} className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-xl text-red-500 shadow-lg hover:bg-white transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-8 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-500">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            </div>
                            <p className="text-gray-900 dark:text-gray-100 font-semibold">Click to select image</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">PNG, JPG up to 5MB</p>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploadingAvatar} />
                </div>
                {isUploadingAvatar && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-300">Uploading...</span>
                            <span className="text-indigo-600">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-indigo-500" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ duration: 0.1 }} />
                        </div>
                    </div>
                )}
                <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={() => setIsUploadModalOpen(false)} disabled={isUploadingAvatar}>Cancel</Button>
                    <Button variant="primary" className="flex-1" onClick={handleUploadAvatar} isLoading={isUploadingAvatar} disabled={!selectedFile}>Upload Image</Button>
                </div>
            </div>
        </Modal>

        {/* Delete Image Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Profile Image" size="sm">
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Are you sure?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Do you really want to delete your profile image? This action cannot be undone.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" className="flex-1" onClick={handleDeleteAvatar}>Delete</Button>
                </div>
            </div>
        </Modal>

        {/* Delete Account Confirmation Modal */}
        <Modal isOpen={isAccountDeleteModalOpen} onClose={() => setIsAccountDeleteModalOpen(false)} title="Deactivate Account" size="sm">
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 text-red-600"><TrashIcon className="w-8 h-8" /></div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Are you absolutely sure?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed px-4">This will deactivate your account and hide your profile. You can reactivate it later by logging back in.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={() => setIsAccountDeleteModalOpen(false)} disabled={isDeletingAccount}>Cancel</Button>
                    <Button variant="danger" className="flex-1" onClick={handleAccountDeletion} isLoading={isDeletingAccount}>Deactivate</Button>
                </div>
            </div>
        </Modal>
    </>
);

export default PersonalDetailsModals;
