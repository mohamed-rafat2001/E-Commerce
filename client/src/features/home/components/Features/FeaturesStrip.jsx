import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiRotateCcw, FiShield, FiHeadphones } from 'react-icons/fi';
import { fadeUp } from '../../../../shared/utils/animations';

const features = [
    {
        icon: <FiTruck className="w-8 h-8 md:w-10 md:h-10" />,
        title: "Free Shipping",
        subtitle: "On orders over $50 worldwide"
    },
    {
        icon: <FiRotateCcw className="w-8 h-8 md:w-10 md:h-10" />,
        title: "Easy Returns",
        subtitle: "30-day hassle-free return policy"
    },
    {
        icon: <FiShield className="w-8 h-8 md:w-10 md:h-10" />,
        title: "Secure Payment",
        subtitle: "256-bit SSL encrypted checkout"
    },
    {
        icon: <FiHeadphones className="w-8 h-8 md:w-10 md:h-10" />,
        title: "24/7 Support",
        subtitle: "We're here whenever you need us"
    }
];

const FeaturesStrip = () => {
    return (
        <section className="bg-gray-50 border-y border-gray-100 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUp}
                            transition={{ delay: idx * 0.15 }}
                            className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 md:gap-6 group"
                        >
                            <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 text-indigo-600 transition-transform group-hover:scale-110 duration-500">
                                {feature.icon}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                                    {feature.subtitle}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesStrip;
