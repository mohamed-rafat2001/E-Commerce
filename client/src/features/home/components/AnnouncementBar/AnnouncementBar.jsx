import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import useAnnouncementBar from '../../hooks/useAnnouncementBar';

const AnnouncementBar = () => {
    const { currentMessage, isVisible, close } = useAnnouncementBar();

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="bg-indigo-600 text-white relative z-[60] overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
                        {/* Placeholder for left-side icon if needed, currently centered text */}
                        <div className="hidden sm:block w-8" />

                        <div className="flex-1 flex items-center justify-center gap-2 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentMessage}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-center"
                                >
                                    {currentMessage}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={close}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                            aria-label="Close announcement"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AnnouncementBar;
