import { Router } from 'express'
import { usersRoutes } from '@/routes/usersRoutes'
import { sessionsRoutes } from '@/routes/sessionsRoutes'

export const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)
