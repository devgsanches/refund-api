import { Request, Response } from 'express'

export class UploadsController {
  async store(req: Request, res: Response) {
    res.json({
      message: 'Uploaded successfully',
    })
  }
}
