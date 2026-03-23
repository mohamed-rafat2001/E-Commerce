import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../../../utils/animations.js';

const FooterSection = () => {
    const footerRef = useRef(null);
    const linksRef = useRef(null);

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

            const staggerLinks = linksRef.current?.querySelectorAll('a');
            if (staggerLinks && staggerLinks.length) {
                gsap.fromTo(
                    staggerLinks,
                    { opacity: 0, y: 10 },
                    {
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
        <footer ref={footerRef} className="bg-gray-900 pt-24 pb-12 text-white overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-20">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-3xl font-black tracking-tight text-white font-display">
                                CuratorMarket
                            </span>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-sm mb-8 opacity-70">
                            The world's most curated destination for designer goods, artisan crafts, and trending aesthetics.
                        </p>
                        <div className="flex gap-4">
                            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer">
                                    <Icon className="w-4 h-4" />
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
                        <div key={section.title} ref={section.title === 'Legals' ? linksRef : null}>
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
