import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    // Use a local image to test
    const result = await cloudinary.uploader.upload('./test.jpg', {
      folder: 'test-uploads',
      public_id: 'sample-test-image',
    });

    console.log('✅ Upload Successful!');
    console.log('Secure URL:', result.secure_url);
  } catch (error) {
    console.error('❌ Upload Failed:', error);
  }
})();
