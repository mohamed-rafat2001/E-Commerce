import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SectionTitle = ({
    title,
    subtitle,
    align = "left",
    actionLabel,
    actionLink,
    className = ""
}) => {
    const isCenter = align === "center";

    return (
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 ${isCenter ? 'items-center text-center sm:flex-col sm:items-center' : ''} ${className}`}>
            <div className={`${isCenter ? 'max-w-2xl mx-auto' : ''}`}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-black text-gray-900 font-display mb-3"
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-500 max-w-2xl"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
            {actionLabel && actionLink && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to={actionLink} className="text-indigo-600 font-bold hover:underline flex items-center gap-2 group">
                        {actionLabel}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default SectionTitle;
