import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { Button } from '../../../../shared/ui';

const SellerCtaBanner = () => {
    return (
        <section className="py-24 bg-white px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 overflow-hidden shadow-2xl shadow-indigo-200">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
                    />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 p-10 md:p-20">
                        {/* Left Side: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 text-white text-center lg:text-left"
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight">
                                Start Selling <br /> <span className="text-amber-400">Today.</span>
                            </h2>

                            <div className="space-y-4 mb-12">
                                {[
                                    "Set up your store in minutes",
                                    "Reach 50,000+ active buyers",
                                    "Keep 95% of every sale"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-center lg:justify-start gap-4">
                                        <div className="bg-amber-400 text-indigo-900 rounded-full p-1 shadow-lg shadow-amber-400/20 shrink-0">
                                            <FiCheckCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-lg md:text-xl font-bold text-indigo-100">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className="!bg-white !text-indigo-900 hover:!bg-amber-400 hover:!text-black font-black px-12 py-6 rounded-2xl shadow-2xl flex items-center justify-center gap-4 text-lg lg:w-fit border-none"
                                onClick={() => window.location.href = '/seller/register'}
                            >
                                Become a Seller <FiArrowRight className="w-6 h-6" />
                            </Button>
                        </motion.div>

                        {/* Right Side: Image/Illustration */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 group">
                                <img
                                    src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1000&auto=format&fit=crop"
                                    alt="Seller dashboard illustration"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                                />
                                <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/0 transition-colors duration-500" />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                        <span className="text-3xl font-black">95%</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-black text-lg leading-none">Payout</p>
                                        <p className="text-gray-400 text-sm font-bold">Revenue Share</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellerCtaBanner;
