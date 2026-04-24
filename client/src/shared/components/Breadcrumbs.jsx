import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { schemas } from './SEOSchemas.js';
import { Helmet } from 'react-helmet-async';

/**
 * Breadcrumb navigation with JSON-LD structured data.
 * Uses semantic <nav> with aria-label for accessibility.
 *
 * @param {Array} items - Array of { name, url } objects. Last item has no url (current page).
 */
export default function Breadcrumbs({ items = [] }) {
    if (!items.length) return null;

    const jsonLd = schemas.breadcrumbs(items);

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>
            <nav
                aria-label="Breadcrumb navigation"
                className="flex items-center text-sm text-gray-400 mb-8 whitespace-nowrap overflow-x-auto no-scrollbar"
            >
                <ol className="flex items-center gap-0" itemScope itemType="https://schema.org/BreadcrumbList">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                            <li
                                key={index}
                                className="flex items-center"
                                itemProp="itemListElement"
                                itemScope
                                itemType="https://schema.org/ListItem"
                            >
                                {index > 0 && (
                                    <FiChevronRight className="mx-2 w-3.5 h-3.5 text-gray-300 flex-shrink-0" aria-hidden="true" />
                                )}
                                {isLast ? (
                                    <span
                                        className="text-gray-800 font-medium truncate"
                                        itemProp="name"
                                        aria-current="page"
                                    >
                                        {item.name}
                                    </span>
                                ) : (
                                    <Link
                                        to={item.url}
                                        className="hover:text-primary transition-colors flex items-center gap-1"
                                        itemProp="item"
                                    >
                                        {index === 0 && <FiHome className="w-3.5 h-3.5" aria-hidden="true" />}
                                        <span itemProp="name">{item.name}</span>
                                    </Link>
                                )}
                                <meta itemProp="position" content={String(index + 1)} />
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
