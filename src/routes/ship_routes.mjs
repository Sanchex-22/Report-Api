import { Router } from 'express'
import { shipController } from '../controllers/shipController.mjs'

const ShipRoutes = Router()

// * Notification Routes
ShipRoutes.post('/new', shipController.new)
ShipRoutes.put('/edit', shipController.edit)
ShipRoutes.delete('/delete', shipController.delete)
ShipRoutes.get('/search', shipController.getSearch)
ShipRoutes.get('/getAll', shipController.getAll)

export default ShipRoutes
