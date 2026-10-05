import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const isS3Configured = Boolean(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_BUCKET_NAME
);

const s3Client = isS3Configured
  ? new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

/**
 * Generate fallback string if S3 is not active or file is not provided.
 * Format: username + activity_type + unique_string
 */
export const generateFallbackImageUrl = (username = 'athlete', activityType = 'workout') => {
  const cleanUsername = String(username).replace(/[^a-zA-Z0-9_-]/g, '');
  const cleanActivity = String(activityType).replace(/[^a-zA-Z0-9_-]/g, '');
  const uniqueString = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return `${cleanUsername}_${cleanActivity}_${uniqueString}`;
};

/**
 * Upload a file to AWS S3. If S3 credentials are not configured,
 * returns the combined fallback string.
 */
export const uploadFileToS3 = async ({ buffer, originalname, mimetype, username, activityType }) => {
  if (!isS3Configured || !s3Client) {
    console.log('AWS S3 credentials not yet configured. Using unique fallback string.');
    return generateFallbackImageUrl(username, activityType);
  }

  try {
    const fileExt = originalname ? originalname.split('.').pop() : 'jpg';
    const key = `activities/${username || 'user'}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype || 'image/jpeg',
    });

    await s3Client.send(command);

    // Return the public S3 URL or CloudFront URL
    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    return s3Url;
  } catch (error) {
    console.error('Error uploading file to AWS S3:', error);
    // Fall back to unique string if S3 fails
    return generateFallbackImageUrl(username, activityType);
  }
};
