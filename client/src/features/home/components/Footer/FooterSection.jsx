import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const FooterSection = () => {
    return (
        <footer className="bg-gray-900 pt-24 pb-12 text-white overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-20">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-2xl shadow-glow">
                                E
                            </div>
                            <span className="text-2xl font-black tracking-tight">E-Commerce</span>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-sm mb-8 opacity-70">
                            Redefining global trade through innovation, accessibility, and trust.
                            Join the next generation of online commerce.
                        </p>
                        <div className="flex gap-4">
                            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                                <div key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 cursor-pointer">
                                    <Icon className="w-5 h-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {[
                        {
                            title: 'Marketplace',
                            links: ['All Products', 'Seller Central', 'Customer Stories', 'Global Logistics'],
                        },
                        {
                            title: 'Resources',
                            links: ['Merchant API', 'Help Center', 'Safety Center', 'Brand Guidelines'],
                        },
                        {
                            title: 'Legals',
                            links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility'],
                        },
                    ].map((section) => (
                        <div key={section.title}>
                            <h4 className="font-black mb-8 uppercase tracking-widest text-xs text-white/50">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors font-medium">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm font-medium">
                    <p>© 2026 E-Commerce Platforms Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-white cursor-pointer transition-colors">System Status</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Feedback</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
