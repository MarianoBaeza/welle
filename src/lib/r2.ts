import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { libraries } from '@/data/products';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const FORTY_EIGHT_HOURS = 48 * 60 * 60;

export interface DownloadLink {
  name: string;
  url: string;
}

export async function getDownloadUrls(
  productSlug: string,
  type: 'library' | 'bundle'
): Promise<DownloadLink[]> {
  const slugs =
    type === 'bundle'
      ? libraries.map((l) => l.slug)
      : [productSlug];

  return Promise.all(
    slugs.map(async (slug) => {
      const lib = libraries.find((l) => l.slug === slug);
      const url = await getSignedUrl(
        r2,
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: `${slug}.zip`,
        }),
        { expiresIn: FORTY_EIGHT_HOURS }
      );
      return {
        name: lib ? `${lib.name} Library` : slug,
        url,
      };
    })
  );
}
