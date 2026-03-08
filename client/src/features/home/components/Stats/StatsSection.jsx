import React from 'react';
import { motion } from 'framer-motion';
import useCounterAnimation from '../../hooks/useCounterAnimation';

const StatItem = ({ target, label, suffix = "", duration = 2500 }) => {
    // Check if target is a number or contains non-numeric chars (like 4.9)
    const isDecimal = String(target).includes('.');
    const numericTarget = parseFloat(target);
    const { displayValue, ref } = useCounterAnimation(numericTarget, duration);

    return (
        <div ref={ref} className="text-center group">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter"
            >
                {isDecimal ? (displayValue / 10).toFixed(1) : displayValue.toLocaleString()}
                <span className="text-indigo-400 ml-1 group-hover:text-amber-400 transition-colors duration-500">
                    {suffix}
                </span>
            </motion.div>
            <div className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors">
                {label}
            </div>
        </div>
    );
};

const StatsSection = () => {
    return (
        <section className="py-32 bg-gray-900 border-y border-white/5 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
                    <StatItem target={50000} label="Happy Customers" suffix="+" />
                    <StatItem target={1200} label="Verified Sellers" suffix="+" />
                    <StatItem target={80000} label="Products Listed" suffix="+" />
                    <StatItem target={49} label="Average Rating" suffix="/ 5" />
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
