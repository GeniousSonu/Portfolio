/**
 * Client-Side Cloudinary Transformation Helper
 * Safe for use in React Server Components (RSC) and Client Components ("use client").
 * Does NOT import any server secrets. Uses cloud name from public env or defaults.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'uvflwz6x';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Builds an optimized Cloudinary delivery URL with auto-format and auto-quality.
 *
 * @param {string} source - Public ID (e.g., 'portfolio/projects/learnai') OR existing Cloudinary URL
 * @param {Object} [options={}] - Transformation options
 * @param {number} [options.width] - Image width in px
 * @param {number} [options.height] - Image height in px
 * @param {string} [options.crop='fill'] - Crop mode ('fill', 'scale', 'fit', 'thumb', 'pad')
 * @param {string} [options.gravity='auto'] - Focus point ('auto', 'center', 'face')
 * @param {string} [options.quality='auto'] - Compression quality ('auto', 'auto:best', 'auto:eco')
 * @param {string} [options.format='auto'] - File format ('auto' delivers WebP/AVIF depending on browser)
 * @returns {string} Optimized CDN URL
 */
export function buildCloudinaryUrl(source, options = {}) {
  if (!source) return '';

  const {
    width,
    height,
    crop = 'fill',
    gravity,
    quality = 'auto',
    format = 'auto',
  } = options;

  // Assemble transformation segments
  const transforms = [];

  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);
  if (crop) transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);

  const transformString = transforms.join(',');

  // If source is already a full Cloudinary URL
  if (typeof source === 'string' && source.includes('res.cloudinary.com')) {
    // If transformations are requested and url is raw upload
    if (transformString && source.includes('/image/upload/')) {
      // Check if already transformed
      if (/image\/upload\/v\d+\//.test(source)) {
        return source.replace('/image/upload/', `/image/upload/${transformString}/`);
      }
      return source.replace(/\/image\/upload\/([^/]+)\//, `/image/upload/${transformString}/$1/`);
    }
    return source;
  }

  // If source is a public ID
  const cleanPublicId = source.startsWith('/') ? source.slice(1) : source;
  return transformString
    ? `${CLOUDINARY_BASE_URL}/${transformString}/${cleanPublicId}`
    : `${CLOUDINARY_BASE_URL}/${cleanPublicId}`;
}

/**
 * Helper to generate responsive srcset string for Next.js or standard img tags
 *
 * @param {string} source - Public ID or Cloudinary URL
 * @param {Array<number>} [widths=[320, 640, 768, 1024, 1280, 1920]]
 * @param {Object} [options={}]
 * @returns {string} srcset formatted string
 */
export function buildCloudinarySrcSet(source, widths = [320, 640, 768, 1024, 1280, 1920], options = {}) {
  if (!source) return '';

  return widths
    .map((w) => `${buildCloudinaryUrl(source, { ...options, width: w })} ${w}w`)
    .join(', ');
}
