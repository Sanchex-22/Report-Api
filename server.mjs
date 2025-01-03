import express from 'express'
import session from 'express-session'
import 'dotenv/config'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'

// * Middleware
import bodyParser from 'body-parser'
import { corsMiddleware } from './src/middleware/CorsMiddleware.mjs'

// * Routes
import authRoutes from './src/routes/auth_routes.mjs'
import UserRouter from './src/routes/UserRoutes.mjs'
import authMagicRoutes from './src/routes/magic_link_routes.mjs'
import CertificatesRouter from './src/routes/certificates_routes.mjs'
import ReportRoutes from './src/routes/report_routes.mjs'
import ShipRoutes from './src/routes/ship_routes.mjs'

const app = express()
const server = createServer(app)

const __dirname = dirname(fileURLToPath(import.meta.url))

// * Middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my-secret-rh',
    resave: false,
    saveUninitialized: true
  })
)

app.use(corsMiddleware)
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })) // Reducido a 10 MB
app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.static(join(__dirname, 'public'))) // Servir archivos estáticos

// * Rutas principales
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html')) // Apunta al index.html en public
})

app.get('/imagen', (req, res) => {
  const imagePath = join(__dirname, 'public/images/IntermaritimeRH.png')
  res.sendFile(imagePath)
})

// * Rutas de API
app.use('/api/user/auth/', authRoutes)
app.use('/api/auth/', authMagicRoutes)
app.use('/api/user/', UserRouter)
app.use('/api/reports/', ReportRoutes)
app.use('/api/certificates/', CertificatesRouter)
app.use('/api/ships/', ShipRoutes)

// * Iniciar servidor
const PORT = process.env.PORT || 3001

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`)
})
