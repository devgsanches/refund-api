import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@/database/prisma'
import { hash } from 'bcrypt'

export const usersRoutes = Router()

usersRoutes.post('/', async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().trim().min(4),
    email: z.string().trim().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = schema.parse(req.body)

  const salt = 10
  const hashedPassword = await hash(password, salt)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  res.status(201).json()
})

usersRoutes.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()

  res.json(users)
})
