import { z } from 'zod'
import 'dotenv/config'

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().default('change-me'),
  ADMIN_BOOTSTRAP_EMAIL: z.string().default('admin@example.com'),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().default('change-me'),

  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default('auto'),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),

  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
})

export const env = schema.parse(process.env)

