import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

// Upload foto, return KEY-nya (bukan URL) untuk disimpan di database
export async function uploadPhoto(buffer, contentType, key) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return key;
}

// Bucket bersifat privat, jadi URL tampil dibuat bertanda tangan per render (berlaku 1 jam)
export async function photoUrl(key) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
    { expiresIn: 3600 }
  );
}

export async function photoUrls(keys) {
  return Promise.all((keys || []).map((k) => photoUrl(k)));
}

export async function deletePhoto(key) {
  if (!key) return;
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
  } catch {
    // gagal hapus di storage tidak boleh menggagalkan proses utama
  }
}
