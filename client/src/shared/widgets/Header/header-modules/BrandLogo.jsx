import { Link } from 'react-router-dom';

/**
 * BrandLogo - Modular branding component for the header
 */
const BrandLogo = () => (
    <Link to="/" className="flex items-center gap-2 group min-w-0">
        <img 
            src="/logo.png" 
            alt="ShopyNow Logo" 
            className="h-7 w-auto md:h-8 mix-blend-multiply dark:mix-blend-normal object-contain transition-transform group-hover:scale-105" 
        />
        <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-display tracking-tightest">
            ShopyNow
        </span>
    </Link>
);

export default BrandLogo;
