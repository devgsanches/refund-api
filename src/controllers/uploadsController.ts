import { Request, Response } from 'express'
import z, { ZodError } from 'zod'
import uploadConfig from '@/configs/upload'

import { DiskStorage } from '@/providers/diskStorage'
import { AppError } from '@/utils/AppError'

export class UploadsController {
  async store(req: Request, res: Response) {
    const diskStorage = new DiskStorage()

    try {
      const { ACCEPTED_IMAGE_TYPES, MAX_FILE, MAX_FILE_SIZE } = uploadConfig

      const fileSchema = z
        .object({
          filename: z.string().min(1, 'Filename é obrigatório.'),
          mimetype: z
            .string()
            .refine(
              type => ACCEPTED_IMAGE_TYPES.includes(type),
              `Formato de arquivo inválido. Formatos permitidos: ${ACCEPTED_IMAGE_TYPES.join(
                ', '
              )}.`
            ),
          size: z
            .number()
            .positive()
            .refine(
              size => size <= MAX_FILE_SIZE,
              `Tamanho máximo do arquivo é de ${MAX_FILE} mb.`
            ),
        })
        .passthrough()

      const file = fileSchema.parse(req.file)
      const filename = await diskStorage.saveFile(file.filename)

      res.status(201).json({
        filename,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        if (req.file) {
          await diskStorage.deleteFile(req.file.filename, 'tmp')
        }

        throw new AppError(error.issues[0].message)
      }

      throw error
    }
  }
}
