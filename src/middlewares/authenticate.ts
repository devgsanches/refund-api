import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/utils/AppError'
import { authConfig } from '@/configs/auth'
import { verify } from 'jsonwebtoken'

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token not provided.', 401)
  }

  const token = authHeader.split(' ')[1]

  const { sub: user_id, role } = verify(token, authConfig.jwt.secret)

  req.user = {
    id: user_id,
    role,
  }

  return next()
}
