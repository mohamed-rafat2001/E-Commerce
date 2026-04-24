const SITE_NAME = 'ShopyNow';
const SITE_URL = 'https://shopynow.com'; // Update with your production URL

/**
 * JSON-LD schema builders for reuse across pages.
 */
export const schemas = {
    /** WebSite schema with SearchAction for the home page */
    webSite: () => ({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }),

    /** Organization schema for the store */
    organization: () => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/assets/images/logo.png`,
        sameAs: [],
    }),

    /** Product schema with Offer and AggregateRating */
    product: (product) => {
        const price = typeof product.price === 'object'
            ? product.price.amount
            : (product.price || 0);
        const brandName = product.brandId?.name || product.brand?.name || SITE_NAME;

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description || `${product.name} by ${brandName}`,
            image: product.coverImage?.secure_url || product.image?.secure_url,
            brand: {
                '@type': 'Brand',
                name: brandName,
            },
            offers: {
                '@type': 'Offer',
                price: price.toFixed(2),
                priceCurrency: 'USD',
                availability: product.countInStock > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                url: `${SITE_URL}/products/${product._id}`,
            },
        };

        if (product.ratingAverage && product.ratingCount > 0) {
            schema.aggregateRating = {
                '@type': 'AggregateRating',
                ratingValue: Number(product.ratingAverage).toFixed(1),
                reviewCount: product.ratingCount,
                bestRating: '5',
                worstRating: '1',
            };
        }

        return schema;
    },

    /** BreadcrumbList schema */
    breadcrumbs: (items) => ({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url ? `${SITE_URL}${item.url}` : undefined,
        })),
    }),
};
