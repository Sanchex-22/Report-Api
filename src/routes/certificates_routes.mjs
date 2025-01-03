import { Router } from 'express'
import { certificatesController } from '../controllers/CertificatesController.mjs'
const CertificatesRouter = Router()

CertificatesRouter.post('/new', certificatesController.new)
CertificatesRouter.get('/getAll', certificatesController.getAll)
CertificatesRouter.post('/get/:id', certificatesController.get)
CertificatesRouter.delete('/delete/:id', certificatesController.delete)
CertificatesRouter.put('/edit/:id')

export default CertificatesRouter
