import { Router } from 'express'
import { reportController } from '../controllers/ReportController.mjs'

const ReportRoutes = Router()

// * Notification Routes
ReportRoutes.post('/new', reportController.new)
ReportRoutes.put('/edit/:id', reportController.edit)
ReportRoutes.delete('/delete/:id', reportController.delete)
ReportRoutes.get('/get/:id', reportController.get)
ReportRoutes.get('/getAll', reportController.getAll)
ReportRoutes.get('/ultimosCreados', reportController.ultimosCreados)
ReportRoutes.get('/getFilterReport', reportController.getFilterReport)

export default ReportRoutes
