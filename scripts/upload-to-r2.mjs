/**
 * Sube los ZIPs de las librerías a Cloudflare R2.
 * Uso: node scripts/upload-to-r2.mjs
 *
 * Requiere las variables de entorno en .env.local:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, statSync, createReadStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Cargar .env.local manualmente
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
    console.log(`[skip] ${local} — no encontrado en ${filePath}`);
    continue;
  }

  // Verificar si ya existe en R2
  try {
    await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    console.log(`[skip] ${key} — ya existe en R2`);
    continue;
  } catch {
    // No existe, hay que subirlo
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

  console.log(`[ok] ${key} subido`);
}

console.log('\nListo. Archivos en R2:');
files.forEach(({ key }) => console.log(`  ${key}`));
