/**
 * Uploads library ZIPs to Cloudflare R2.
 * Usage: node scripts/upload-to-r2.mjs
 *
 * Requires the following env vars in .env.local:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, statSync, createReadStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME;
const ZIPS_DIR = join(__dirname, '..', '..', 'welle-material', 'zips');

const files = [
  { local: 'asmr.zip',             key: 'asmr.zip' },
  { local: 'content-creator.zip',  key: 'content-creator.zip' },
  { local: 'cinematic.zip',        key: 'cinematic.zip' },
];

for (const { local, key } of files) {
  const filePath = join(ZIPS_DIR, local);

  let size;
  try {
    size = statSync(filePath).size;
  } catch {
    console.log(`[skip] ${local} — not found at ${filePath}`);
    continue;
  }

  // Skip if already uploaded
  try {
    await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    console.log(`[skip] ${key} — already exists in R2`);
    continue;
  } catch {
    // Does not exist yet — proceed with upload
  }

  const sizeMB = (size / 1024 / 1024).toFixed(1);
  console.log(`[upload] ${key} (${sizeMB} MB)...`);

  const stream = createReadStream(filePath);
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: stream,
      ContentType: 'application/zip',
      ContentLength: size,
    })
  );

  console.log(`[ok] ${key} uploaded`);
}

console.log('\nDone. Files in R2:');
files.forEach(({ key }) => console.log(`  ${key}`));
