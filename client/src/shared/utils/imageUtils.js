/**
 * Helper to generate Cloudinary transformations for responsive images.
 * @param {string} url - The original Cloudinary URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} [options.crop='fill'] - Crop mode (e.g., 'fill', 'scale', 'thumb')
 * @returns {string} - Transformed URL
 */
export const getOptimizedImageUrl = (url, { width, height, crop = 'fill' } = {}) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com')) return url;

  // Split the URL to insert transformations
  // Format: .../upload/[transformations]/v.../...
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transforms = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  
  // Best practice: auto format and quality
  transforms.push('f_auto');
  transforms.push('q_auto');

  return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
};

/**
 * Returns a srcset string for responsive img tags
 */
export const getCloudinarySrcSet = (url, widths = [300, 600, 900, 1200]) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  return widths
    .map(w => `${getOptimizedImageUrl(url, { width: w })} ${w}w`)
    .join(', ');
};
