import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'ShopyNow';
const SITE_URL = 'https://shopynow.com'; // Update with your production URL
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/og-default.jpg`;
const DEFAULT_DESCRIPTION = 'Discover curated luxury fashion, tech gadgets, and home essentials at ShopyNow. Premium products, unbeatable prices, and fast delivery.';

/**
 * Dynamic SEO component for per-route meta tags.
 * 
 * @param {string} title - Page title
 * @param {string} description - Meta description (max 160 chars)
 * @param {string} canonical - Canonical URL path (e.g. "/products/my-product")
 * @param {string} ogImage - Open Graph image URL (1200x630px recommended)
 * @param {string} ogType - Open Graph type (default: "website")
 * @param {boolean} noIndex - Set to true for pages that should not be indexed (cart, checkout, admin)
 * @param {object|array} jsonLd - JSON-LD structured data object(s)
 */
export default function SEO({
    title,
    description = DEFAULT_DESCRIPTION,
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    noIndex = false,
    jsonLd,
}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const fullCanonical = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

    // Support single object or array of JSON-LD
    const jsonLdArray = jsonLd
        ? Array.isArray(jsonLd) ? jsonLd : [jsonLd]
        : [];

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullCanonical} />
            <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:site_name" content={SITE_NAME} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD Structured Data */}
            {jsonLdArray.map((ld, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(ld)}
                </script>
            ))}
        </Helmet>
    );
}


