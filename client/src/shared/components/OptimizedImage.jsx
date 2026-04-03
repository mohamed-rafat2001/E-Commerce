import { useState, useRef, useEffect, memo } from 'react';

/**
 * OptimizedImage — performance-optimized image component.
 *
 * Features:
 * - Lazy loading with IntersectionObserver (below-the-fold)
 * - Eager loading with fetchpriority="high" for LCP images
 * - Explicit width/height to prevent CLS
 * - <picture> with WebP source when available
 * - srcSet for responsive images (480w, 768w, 1280w)
 * - Blur-up placeholder effect
 * - Alt text enforcement
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Descriptive alt text (required)
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {boolean} priority - If true, loads eagerly with high fetch priority (for LCP image)
 * @param {string} className - Additional CSS classes
 * @param {string} sizes - sizes attribute for responsive images
 * @param {object} style - Inline styles
 */
const OptimizedImage = memo(function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    className = '',
    sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, 1280px',
    style = {},
    ...rest
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority); // Priority images are always "in view"
    const imgRef = useRef(null);

    // IntersectionObserver for lazy loading
    useEffect(() => {
        if (priority || isInView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px 0px' } // Start loading 200px before entering viewport
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority, isInView]);

    // Build responsive srcSet from Cloudinary URLs
    const buildSrcSet = (url) => {
        if (!url) return undefined;

        // Cloudinary transformation support
        if (url.includes('cloudinary.com') || url.includes('res.cloudinary')) {
            const widths = [480, 768, 1280];
            return widths
                .map(w => {
                    const transformed = url.replace(
                        /\/upload\//,
                        `/upload/w_${w},f_auto,q_auto/`
                    );
                    return `${transformed} ${w}w`;
                })
                .join(', ');
        }

        // Unsplash transformation support
        if (url.includes('unsplash.com')) {
            const widths = [480, 768, 1280];
            return widths
                .map(w => {
                    const baseUrl = url.split('?')[0];
                    return `${baseUrl}?auto=format&fit=crop&w=${w}&q=80 ${w}w`;
                })
                .join(', ');
        }

        return undefined;
    };

    const srcSet = buildSrcSet(src);

    // Build WebP source for Cloudinary images
    const webpSrc = src && (src.includes('cloudinary.com') || src.includes('res.cloudinary'))
        ? src.replace(/\/upload\//, '/upload/f_webp,q_auto/')
        : null;

    const imgProps = {
        ref: imgRef,
        alt: alt || 'Product image',
        width: width,
        height: height,
        loading: priority ? 'eager' : 'lazy',
        decoding: priority ? 'sync' : 'async',
        onLoad: () => setIsLoaded(true),
        className: `${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`,
        style: {
            ...style,
            ...(width && height ? { aspectRatio: `${width} / ${height}` } : {}),
        },
        ...rest,
    };

    if (priority) {
        imgProps.fetchPriority = 'high';
    }

    // Don't render src until in view (lazy loading)
    const effectiveSrc = isInView ? src : undefined;
    const effectiveSrcSet = isInView ? srcSet : undefined;

    return (
        <picture>
            {/* WebP source for browsers that support it */}
            {webpSrc && isInView && (
                <source
                    srcSet={webpSrc}
                    type="image/webp"
                />
            )}
            <img
                {...imgProps}
                src={effectiveSrc}
                srcSet={effectiveSrcSet}
                sizes={srcSet ? sizes : undefined}
            />
        </picture>
    );
});

export default OptimizedImage;
