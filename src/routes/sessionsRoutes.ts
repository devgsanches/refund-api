import { Router } from 'express'
import { SessionsController } from '@/controllers/sessionsController'

export const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post('/', sessionsController.store)
