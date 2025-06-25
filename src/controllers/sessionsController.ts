import { Request, Response } from 'express'
import { AppError } from '@/utils/AppError'
import { authConfig } from '@/configs/auth'
import { prisma } from '@/database/prisma'
import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import { z } from 'zod'

export class SessionsController {
  async store(req: Request, res: Response) {
    const schema = z.object({
      email: z.string().trim().email(),
      password: z.string(),
    })

    const { email, password } = schema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new AppError('Email e/ou senha incorretos.')
    }

    const verify = await compare(password, user.password)

    if (!verify) {
      throw new AppError('Email e/ou senha incorretos.')
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign(
      {
        role: user.role,
      },
      secret,
      {
        expiresIn,
        subject: String(user.id),
      }
    )

    const { password: hashedPass, ...userRest } = user

    res.status(201).json({
      token,
      user: userRest,
    })
  }
}
