import { createApp } from './app.js'
import { env } from './env.js'
import { publicRouter } from './routes/public.js'

const app = createApp()
app.use('/public', publicRouter)
app.listen(env.PORT, () => {
  console.log(`[api] listening on http://localhost:${env.PORT}`)
})

