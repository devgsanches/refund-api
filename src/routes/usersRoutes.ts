import { Router } from 'express'
import { UsersController } from '@/controllers/usersController'
import { verifyUserAuthorization } from '@/middlewares/authorization'
import { authenticate } from '@/middlewares/authenticate'

export const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.get('/', usersController.index)
usersRoutes.post('/', usersController.store)
usersRoutes.delete(
  '/:id',
  authenticate,
  verifyUserAuthorization(['manager']),
  usersController.delete
)
