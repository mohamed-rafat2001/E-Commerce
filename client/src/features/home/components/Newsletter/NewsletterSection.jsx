import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import { Button } from '../../../../shared/ui';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
        }
    };

    return (
        <section className="py-24 bg-white px-4">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3.5rem] bg-indigo-600 overflow-hidden px-8 py-20 md:px-20 text-center shadow-glow">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
                    />

                    <div className="relative z-10 max-w-2xl mx-auto text-white">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Stay in the Loop</h2>
                        <p className="text-indigo-100 text-lg mb-12 opacity-80">
                            Subscribe to our newsletter and get exclusive access to new arrivals,
                            flash sales, and seasonal discounts.
                        </p>

                        <AnimatePresence mode="wait">
                            {!isSubscribed ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onSubmit={handleSubmit}
                                    className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-2 rounded-3xl backdrop-blur-md border border-white/20"
                                >
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent border-none px-6 py-4 text-white placeholder-indigo-200 outline-none focus:ring-0"
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto !bg-white !text-indigo-600 hover:!bg-indigo-50 font-black px-10 py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2"
                                    >
                                        Subscribe <FiSend />
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center gap-4 py-4"
                                >
                                    <FiCheckCircle className="text-6xl text-emerald-400" />
                                    <h3 className="text-2xl font-black">You're Subscribed!</h3>
                                    <p className="text-indigo-100 italic">Check your inbox for our latest updates soon.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
