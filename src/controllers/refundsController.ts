import { Request, Response } from 'express'
import { z } from 'zod'
import { Category } from '../../generated/prisma'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { includes } from 'zod/v4'

export class RefundsController {
  async index(req: Request, res: Response) {
    const schemaQuery = z.object({
      name: z.string().trim().optional(),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional(),
    })

    const { name, page, perPage } = schemaQuery.parse(req.query)

    const take = perPage ? perPage : 6

    const skip = (page - 1) * take

    if (!req.user) {
      throw new AppError('Unauthorized.', 401)
    }

    const refunds = await prisma.refund.findMany({
      skip,
      take,
      where: {
        user: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    const refundsTotal = await prisma.refund.findMany({
      where: {
        user: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      },
    })

    const pageCount = Math.ceil(refundsTotal.length / take)

    res.json({
      refunds,
      pagination: {
        page,
        perPage: take,
        recordsTotal: refundsTotal.length,
        pageTotal: pageCount,
      },
    })
  }

  async show(req: Request, res: Response) {
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = schemaParams.parse(req.params)

    const refund = await prisma.refund.findUnique({
      where: {
        id,
      },
    })

    if (!refund) {
      throw new AppError('Refund not found.')
    }

    res.json(refund)
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
