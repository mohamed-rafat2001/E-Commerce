import { Outlet } from 'react-router-dom';
import Header from '../widgets/Header/Header.jsx';
import { FooterSection } from '../../features/home/components/index.js';
import useLenis from '../../hooks/useLenis.js';

const PublicLayout = () => {
    useLenis();
    return (
        <div className="min-h-dvh bg-white flex flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer role="contentinfo">
                <FooterSection />
            </footer>
        </div>
    );
};

export default PublicLayout;
