import { Request, Response } from 'express'
import { z } from 'zod'
import { Category } from '../../generated/prisma'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { includes } from 'zod/v4'

export class RefundsController {
  async index(req: Request, res: Response) {
    const schemaQuery = z.object({
      name: z
        .string({
          message: 'Query params must be text.',
        })
        .optional()
        .default(''),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    })

    const { name, page, perPage } = schemaQuery.parse(req.query)

    // skip calculation (paginação baseada no resultado do filtro)
    const skip = (page - 1) * perPage

    const refunds = await prisma.refund.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim().charAt(0).toUpperCase(),
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    const totalRecords = await prisma.refund.count({
      where: {
        user: {
          name: {
            contains: name.trim().charAt(0).toUpperCase(),
          },
        },
      },
    })

    // uso do math.ceil() para formular mais uma página caso dê número quebrado, e exibo nela, os registros restantes.
    const totalPages = Math.ceil(totalRecords / perPage)

    res.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    })
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
