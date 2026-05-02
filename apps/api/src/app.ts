import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { getLocalUploadsDir, LOCAL_UPLOADS_PREFIX } from './services/localUpload.js'
import { productsRouter } from './routes/products.js'
import { ordersRouter } from './routes/orders.js'
import { authRouter } from './routes/auth.js'
import { adminRouter } from './routes/admin.js'
import { uploadsRouter } from './routes/uploads.js'
import { paymentsRouter } from './routes/payments.js'
import { publicRouter } from './routes/public.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  )
  app.use(morgan('dev'))
  app.use(express.json({ limit: '10mb' }))
  app.use(cookieParser())
  app.use(LOCAL_UPLOADS_PREFIX, express.static(getLocalUploadsDir()))

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/products', productsRouter)
  app.use('/orders', ordersRouter)
  app.use('/uploads', uploadsRouter)
  app.use('/payments', paymentsRouter)
  app.use('/auth', authRouter)
  app.use('/admin', adminRouter)
  app.use('/public', publicRouter)

  return app
}
