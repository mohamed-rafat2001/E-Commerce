import { motion } from 'framer-motion';
import { Badge, Card } from '../../../shared/ui/index.js';
import { FiArrowRight } from 'react-icons/fi';

const FeaturesSection = ({ features }) => {
    return (
        <section className="py-24 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <Badge variant="secondary" className="mb-4">Ecosystem</Badge>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">Built for Everyone</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Whether you're browsing, building a brand, or managing the platform,
                        we provide the tools you need to succeed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card variant="elevated" className="h-full p-8 group hover:border-indigo-500 transition-colors duration-300 rounded-[2.5rem] border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="space-y-3">
                                    {feature.links.map((link, lIdx) => (
                                        <div key={lIdx} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                            <span className={`text-${feature.color}-500`}>{link.icon}</span>
                                            {link.label}
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-10 flex items-center gap-2 text-indigo-600 font-bold group/btn">
                                    Learn More <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
