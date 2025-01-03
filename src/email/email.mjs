import 'dotenv/config'

export const emailConfig = {
  MAIL: process.env.EMAIL,
  MAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  MAIL_HOST: process.env.EMAIL_HOST,
  MAIL_PORT: process.env.EMAIL_PORT,
  MAIL_SECURE: process.env.EMAIL_SECURE,
  MAIL_POOL: process.env.EMAIL_POOL,
  URL: process.env.VERSION_LINK || 'http://localhost:5173',
  API_URL: process.env.API_VERSION_LINK || 'http://localhost:3001',
  VERSION: process.env.VERSION || 'localhost'
}
