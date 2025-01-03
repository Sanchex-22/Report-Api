import 'dotenv/config'

export const CloudinaryConfig = {
  NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.CLOUD_API_KEY,
  API_SECRET: process.env.API_SECRET
}
export default CloudinaryConfig
