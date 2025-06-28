import fs from 'node:fs'
import path from 'node:path'

import uploadConfig from '@/configs/upload'

export class DiskStorage {
  async saveFile(fileName: string) {
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, fileName)
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, fileName)

    try {
      await fs.promises.access(tmpPath)
    } catch (err) {
      console.log(err)
      throw new Error('Erro ao salvar arquivo.')
    }

    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true })
    await fs.promises.rename(tmpPath, destPath)

    return fileName
  }

  async deleteFile(fileName: string, type: 'tmp' | 'uploads') {
    const pathFile =
      type === 'tmp' ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER

    const filePath = path.resolve(pathFile, fileName)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}
