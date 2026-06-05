import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

if (!env.CLOUDINARY_URL) {
  console.warn('⚠️ CLOUDINARY_URL is missing. Media uploads will fail.');
}

// Cloudinary automatically picks up the CLOUDINARY_URL environment variable if set in process.env.
// However, to be explicit we can configure it.
cloudinary.config({
  secure: true
});

export default cloudinary;
