import cloudinary from '../../config/Cloudinary.mjs'

cloudinary.config({
  cloud_name: cloudinary.NAME,
  api_key: cloudinary.API_KEY,
  api_secret: cloudinary.API_SECRET
})
