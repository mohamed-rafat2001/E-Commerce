import { memo } from 'react';
import DropdownMenu from '../DropdownMenu.jsx';
import NavLinkItem from './NavLinkItem.jsx';

/**
 * DesktopNav - Renders the horizontal navigation bar for large screens
 */
const DesktopNav = memo(({ brands, categories, staticLinks, helpLinks }) => {
    return (
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Mega Dropdowns */}
            <DropdownMenu
                label="Brands"
                items={brands}
                basePath="/brands"
                viewAllPath="/brands/all"
            />
            <DropdownMenu
                label="Categories"
                items={categories}
                basePath="/categories"
                viewAllPath="/categories/all"
            />

            {/* Static & Help Links */}
            {staticLinks.map((link) => (
                link.isHelp ? (
                    <DropdownMenu
                        key={link.name}
                        label={link.name}
                        items={helpLinks}
                        basePath=""
                        viewAllPath="/help"
                        isSimple={true}
                    />
                ) : (
                    <NavLinkItem key={link.name} link={link} />
                )
            ))}
        </div>
    );
});

export default DesktopNav;
