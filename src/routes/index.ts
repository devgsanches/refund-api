import { Router } from 'express'
import { usersRoutes } from '@/routes/usersRoutes'
import { sessionsRoutes } from '@/routes/sessionsRoutes'
import { refundsRoutes } from './refundsRoutes'
import { authenticate } from '@/middlewares/authenticate'

export const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)

routes.use(authenticate)
routes.use('/refunds', refundsRoutes)
