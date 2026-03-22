import { Outlet } from 'react-router-dom';
import Header from '../widgets/Header/Header.jsx';
import { FooterSection } from '../../features/home/components/index.js';

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <Outlet />
            </main>
            <FooterSection />
        </div>
    );
};

export default PublicLayout;
