import cors from 'cors'
// import CorsConfig from '../../config/cors_origin.mjs'

// const origins = CorsConfig.ORIGINS.split(',') || []

const corsMiddleware = cors({
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Content-Disposition'],
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
})

export { corsMiddleware }
