import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '../../../../shared/ui';

const DeleteProductModal = ({ isOpen, onClose, onConfirm, isDeleting, productName }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100"
                    >
                        <div className="p-10 pt-12 text-center">
                            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <FiAlertTriangle className="w-10 h-10" />
                            </div>

                            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Permanent Removal</h2>
                            <p className="text-gray-500 font-medium leading-relaxed px-4 mb-10">
                                You are about to permanently delete <span className="text-gray-900 font-black">"{productName}"</span>. This action will remove all associated metadata and cannot be undone.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="!rounded-2xl !h-14 font-black uppercase tracking-widest text-[10px]"
                                >
                                    Abort Action
                                </Button>
                                <Button
                                    variant="danger"
                                    size="lg"
                                    onClick={onConfirm}
                                    isLoading={isDeleting}
                                    className="!rounded-2xl !h-14 font-black uppercase tracking-widest text-[10px] !bg-rose-500 hover:!bg-rose-600 shadow-xl shadow-rose-100"
                                >
                                    Confirm Delete
                                </Button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteProductModal;
