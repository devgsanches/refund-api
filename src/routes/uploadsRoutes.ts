import { Router } from 'express'

import multer from 'multer'
import uploadConfig from '@/configs/upload'

import { UploadsController } from '@/controllers/uploadsController'

export const uploadsRoutes = Router()
const uploadsController = new UploadsController()

const upload = multer(uploadConfig.MULTER)

uploadsRoutes.post('/', upload.single('file'), uploadsController.store)
