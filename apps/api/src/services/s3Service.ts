import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../env.js'

function requireS3() {
  if (!env.S3_ENDPOINT || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY || !env.S3_BUCKET) {
    throw new Error('S3 is not configured')
  }
  return {
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    bucket: env.S3_BUCKET,
  }
}

export function createS3Client() {
  const cfg = requireS3()
  return {
    bucket: cfg.bucket,
    client: new S3Client({
      region: cfg.region,
      endpoint: cfg.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
    }),
  }
}

export async function presignPutObject(key: string, contentType: string) {
  const { client, bucket } = createS3Client()
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })
  return await getSignedUrl(client, cmd, { expiresIn: 60 * 10 })
}

export async function presignGetObject(key: string) {
  const { client, bucket } = createS3Client()
  const cmd = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })
  return await getSignedUrl(client, cmd, { expiresIn: 60 * 10 })
}

