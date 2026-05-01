import { Outlet } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Header from '../widgets/Header/Header.jsx';
import useLenis from '../../hooks/useLenis.js';

const FooterSection = lazy(() => import('../../features/home/components/Footer/FooterSection.jsx'));

const PublicLayout = () => {
    useLenis({ smooth: true });
    const [shouldRenderFooter, setShouldRenderFooter] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const idle = window.requestIdleCallback
            ? window.requestIdleCallback(() => setShouldRenderFooter(true))
            : setTimeout(() => setShouldRenderFooter(true), 350);

        return () => {
            if (typeof idle === 'number') {
                clearTimeout(idle);
            } else if (window.cancelIdleCallback) {
                window.cancelIdleCallback(idle);
            }
        };
    }, []);

    return (
        <div className="min-h-dvh bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
            <Header />
            <main className="flex-1 pt-[88px]">
                <Outlet />
            </main>
            <footer role="contentinfo">
                {shouldRenderFooter ? (
                    <Suspense fallback={null}>
                        <FooterSection />
                    </Suspense>
                ) : (
                    <div className="h-24 bg-gray-900" aria-hidden="true" />
                )}
            </footer>
        </div>
    );
};

export default PublicLayout;
