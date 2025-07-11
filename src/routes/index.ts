import { Router } from 'express'
import { usersRoutes } from '@/routes/usersRoutes'
import { sessionsRoutes } from '@/routes/sessionsRoutes'
import { refundsRoutes } from './refundsRoutes'
import { uploadsRoutes } from '@/routes/uploadsRoutes'
import { authenticate } from '@/middlewares/authenticate'
import { verifyUserAuthorization } from '@/middlewares/authorization'

export const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)

routes.use('/uploads', uploadsRoutes)
routes.use('/refunds', authenticate, refundsRoutes)
