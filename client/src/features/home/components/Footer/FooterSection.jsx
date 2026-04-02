import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../../../utils/animations.js';

const FooterSection = () => {
    const footerRef = useRef(null);
    const footerSections = [
        {
            title: 'Shop',
            links: [
                { label: 'All Products', to: '/products' },
                { label: 'Brands', to: '/brands/all' },
                { label: 'Categories', to: '/categories/all' },
                { label: 'Cart', to: '/cart' },
                { label: 'Wishlist', to: '/public-wishlist' },
            ],
        },
        {
            title: 'Account',
            links: [
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
                { label: 'Checkout', to: '/checkout' },
                { label: 'Orders', to: '/orders' },
                { label: 'Profile', to: '/profile' },
            ],
        },
    ];

    useGSAP(() => {
        if (prefersReducedMotion()) return;
        if (!footerRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (footerRef.current) {
                gsap.fromTo(
                    footerRef.current,
                    { opacity: 0, y: 40 },
                    {
                        immediateRender: false,
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: footerRef.current,
                            start: 'top 90%',
                        },
                    }
                );
            }

            const staggerLinks = footerRef.current?.querySelectorAll('a');
            if (staggerLinks && staggerLinks.length) {
                gsap.fromTo(
                    staggerLinks,
                    { opacity: 0, y: 10 },
                    {
                        immediateRender: false,
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        stagger: 0.05,
                        delay: 0.3,
                        scrollTrigger: {
                            trigger: footerRef.current,
                            start: 'top 90%',
                        },
                    }
                );
            }
        }, footerRef.current);

        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="bg-gray-900 pt-24 pb-12 text-white overflow-hidden border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-20">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-3xl font-black tracking-tight text-white font-display">
                                ShopyNow
                            </span>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-sm mb-8 opacity-70">
                            The world's most curated destination for designer goods, artisan crafts, and trending aesthetics.
                        </p>
                        <div className="flex gap-4">
                            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 cursor-pointer">
                                    <Icon className="w-4 h-4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-black mb-8 uppercase tracking-widest text-xs text-white/50">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.to} className="text-gray-400 hover:text-indigo-400 transition-colors font-medium">
                                            {link.label}
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
