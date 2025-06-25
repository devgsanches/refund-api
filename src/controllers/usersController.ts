import { Request, Response } from 'express'
import { prisma } from '@/database/prisma'
import { hash } from 'bcrypt'
import { z } from 'zod'
import { UserRole } from '../../generated/prisma'
import { AppError } from '@/utils/AppError'

export class UsersController {
  async index(req: Request, res: Response) {
    const users = await prisma.user.findMany()

    res.json(users)
  }

  async store(req: Request, res: Response) {
    const schema = z.object({
      name: z.string().trim().min(4),
      email: z.string().trim().email(),
      password: z.string().min(6),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    })

    const { name, email, password, role } = schema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      throw new AppError('There is already a user registered with this email.')
    }

    const salt = 10
    const hashedPassword = await hash(password, salt)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    res.status(201).json()
  }

  async delete(req: Request, res: Response) {
    const paramsSchema = z.object({
      id: z.string().trim().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new AppError('User not found.')
    }

    await prisma.user.delete({
      where: {
        id,
      },
    })

    res.json()
  }
}
