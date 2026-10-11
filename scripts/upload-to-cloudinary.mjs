import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configure Cloudinary using user's credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'uvflwz6x',
  api_key: process.env.CLOUDINARY_API_KEY || '829647793376663',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6DOrofRJiBhABqNlUsMA7TCsAbQ',
  secure: true,
});

const ASSETS_TO_UPLOAD = [
  {
    localPath: 'public/icon-512.png',
    folder: 'portfolio/branding',
    publicId: 'icon-512',
    tags: ['branding', 'avatar', 'portfolio'],
  },
  {
    localPath: 'public/icon-192.png',
    folder: 'portfolio/branding',
    publicId: 'icon-192',
    tags: ['branding', 'pwa', 'portfolio'],
  },
  {
    localPath: 'public/plugin/genioussonu-site-checkup/assets/lofo-board.png',
    folder: 'portfolio/plugin',
    publicId: 'site-checkup-dashboard',
    tags: ['plugin', 'site-checkup', 'screenshot'],
  },
  {
    localPath: 'public/plugin/genioussonu-site-checkup/assets/logo-concept.png',
    folder: 'portfolio/plugin',
    publicId: 'site-checkup-concept',
    tags: ['plugin', 'site-checkup', 'branding'],
  },
];

async function runUpload() {
  console.log('[Cloudinary] Starting initial asset synchronization...');
  const uploadedManifest = {};

  for (const asset of ASSETS_TO_UPLOAD) {
    const fullPath = path.join(projectRoot, asset.localPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`[Cloudinary] Skipping missing local file: ${asset.localPath}`);
      continue;
    }

    try {
      console.log(`[Cloudinary] Uploading ${asset.localPath} to ${asset.folder}/${asset.publicId}...`);
      const result = await cloudinary.uploader.upload(fullPath, {
        folder: asset.folder,
        public_id: asset.publicId,
        tags: asset.tags,
        overwrite: true,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      });

      console.log(`  ✓ Uploaded successfully: ${result.secure_url}`);
      uploadedManifest[asset.publicId] = {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (err) {
      console.error(`  ✗ Failed to upload ${asset.localPath}:`, err.message);
    }
  }

  // Save manifest for reference
  const manifestPath = path.join(projectRoot, 'src', 'data', 'cloudinaryManifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(uploadedManifest, null, 2), 'utf-8');
  console.log(`[Cloudinary] Asset manifest saved to ${manifestPath}`);
  console.log('[Cloudinary] Upload process complete!');
}

runUpload().catch((err) => {
  console.error('[Cloudinary] Fatal script error:', err);
  process.exit(1);
});
