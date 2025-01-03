import { userController } from '../controllers/UserController.mjs'
import { Router } from 'express'
import { AuthMiddlewire } from '../middleware/AuthMiddleware.mjs'
const UserRouter = Router()

// * User Routes
UserRouter.post('/admin/newUser', AuthMiddlewire.Authorization, userController.newUser)
UserRouter.get('/admin/getAllUser', AuthMiddlewire.Authorization, userController.getAllUser)
UserRouter.delete('/admin/deleteUser', AuthMiddlewire.Authorization, userController.deleteUser)
UserRouter.put('/admin/editUser', AuthMiddlewire.Authorization, userController.editUser)
UserRouter.put('/editAvatar', userController.editUserAvatar)
UserRouter.get('/admin/getUser/:id', AuthMiddlewire.Authorization, userController.getUser)
UserRouter.get('/getAllAdminUser', AuthMiddlewire.Authorization, userController.getAllUserAdmin)
UserRouter.get('/getProfile/:id', AuthMiddlewire.Authorization, userController.getProfile)
UserRouter.get('/dragable', userController.getDragableUsers)

export default UserRouter
