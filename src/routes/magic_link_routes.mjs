import { authController } from '../controllers/AuthController.mjs'
import { Router } from 'express'

const authMagicRoutes = Router()

// * Auth Routes
authMagicRoutes.get('/activate-account', authController.activateAccount)

export default authMagicRoutes
