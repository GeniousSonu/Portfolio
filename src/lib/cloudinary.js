import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

// Configure server-side Cloudinary instance securely
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'uvflwz6x',
  api_key: process.env.CLOUDINARY_API_KEY || '829647793376663',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6DOrofRJiBhABqNlUsMA7TCsAbQ',
  secure: true,
});

export { cloudinary };

/**
 * Uploads an image or file buffer/path to Cloudinary with automatic optimization.
 *
 * @param {string|Buffer} source - File path, base64 data URI, or buffer to upload
 * @param {Object} options - Upload options
 * @param {string} [options.folder='portfolio'] - Cloudinary folder prefix
 * @param {string} [options.publicId] - Specific public ID name
 * @param {Array<string>} [options.tags] - Search and management tags
 * @param {string} [options.resourceType='image'] - Resource type ('image', 'raw', 'video')
 * @returns {Promise<Object>} Upload result containing secure_url, public_id, width, height, format
 */
export async function uploadImage(source, options = {}) {
  const {
    folder = 'portfolio',
    publicId,
    tags = ['portfolio'],
    resourceType = 'image',
    transformation = [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  } = options;

  const uploadOptions = {
    folder,
    resource_type: resourceType,
    tags,
    transformation,
    overwrite: true,
    invalidate: true,
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  try {
    const result = await cloudinary.uploader.upload(source, uploadOptions);
    return {
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('[Cloudinary] Server upload error:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}

/**
 * Deletes an asset from Cloudinary by its public ID.
 *
 * @param {string} publicId - The public ID of the asset
 * @param {string} [resourceType='image'] - The type of resource
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteImage(publicId, resourceType = 'image') {
  if (!publicId) return { success: false, reason: 'Missing publicId' };

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return { success: result.result === 'ok', result: result.result };
  } catch (error) {
    console.error('[Cloudinary] Server delete error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generates an optimized, signed or public CDN URL for a Cloudinary public ID.
 *
 * @param {string} publicId - The asset public ID
 * @param {Object} [transforms={}] - Transformation options (width, height, crop, quality)
 * @returns {string} Fully transformed Cloudinary CDN URL
 */
export function getOptimizedCloudinaryUrl(publicId, transforms = {}) {
  if (!publicId) return '';

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = transforms;

  return cloudinary.url(publicId, {
    secure: true,
    quality,
    fetch_format: format,
    crop,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  });
}
