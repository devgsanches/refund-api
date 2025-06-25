import { Request, Response } from 'express'
import { z } from 'zod'
import { Category } from '../../generated/prisma'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'

export class RefundsController {
  async index(req: Request, res: Response) {
    const refunds = await prisma.refund.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    res.json(refunds)
  }

  async store(req: Request, res: Response) {
    const schema = z.object({
      name: z.string().trim(),
      amount: z.number().positive({
        message: 'O valor do reembolso deve ser maior que 0.',
      }),
      category: z.enum([
        Category.accommodation,
        Category.food,
        Category.others,
        Category.services,
        Category.transport,
      ]),
      filepath: z.string(),
    })

    const { name, amount, category, filepath } = schema.parse(req.body)

    if (!req.user?.id) {
      throw new AppError('Unauthorized.', 401)
    }

    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
    })

    if (!user) {
      throw new AppError('User not found.')
    }

    const refund = await prisma.refund.create({
      data: {
        name,
        amount,
        category,
        filepath,
        userId: req.user.id,
      },
    })

    res.status(201).json(refund)
  }

  async delete(req: Request, res: Response) {
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = schemaParams.parse(req.params)

    try {
      await prisma.refund.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      throw new AppError('Refund not found.', 404)
    }

    res.json()
  }
}
