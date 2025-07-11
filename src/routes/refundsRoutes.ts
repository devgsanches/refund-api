import { Router } from 'express'
import { RefundsController } from '@/controllers/refundsController'
import { verifyUserAuthorization } from '@/middlewares/authorization'

export const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.get(
  '/',
  verifyUserAuthorization(['manager']),
  refundsController.index
)
refundsRoutes.get('/:id', verifyUserAuthorization(['manager']), refundsController.show)
refundsRoutes.post('/', refundsController.store)
refundsRoutes.delete('/:id', verifyUserAuthorization(['manager']), refundsController.delete)
