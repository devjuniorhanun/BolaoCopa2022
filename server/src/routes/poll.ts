import { z } from "zod"
import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import ShortUniqueId from "short-unique-id"
import { authenticate } from "../plugins/authenticate"

// Listando todas as rotas dos bolões
export async function pollRoutes(fastify: FastifyInstance) {
  // exibe a quantidade de bolões
  fastify.get('/polls/count', async () => {
    const count = await prisma.poll.count()

    return { count }
  })

  // Inseri um novo bolão
  fastify.post('/polls', async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body);

    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    try {
      await request.jwtVerify()

      await prisma.poll.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub,
            }
          }
        }
      })
    } catch {
      await prisma.poll.create({
        data: {
          title,
          code,
        }
      })
    }



    return reply.status(201).send({ code })
  })

  fastify.post('/polls/join', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const joinPoolBody = z.object({
      code: z.string(),
    })

    const { code } = joinPoolBody.parse(request.body)

    const poll = await prisma.poll.findUnique({
      where: {
        code,
      },
      include: {
        participants: {
          where: {
            userId: request.user.sub,
          }
        }
      }
    })

    if (!poll) {
      return reply.status(400).send({
        message: 'Pool not found.'
      })
    }

    if (poll.participants.length > 0) {
      return reply.status(400).send({
        message: 'You are already a join this poll.'
      })
    }

    if (!poll.ownerId) {
      await prisma.poll.update({
        where: {
          id: poll.id,
        },
        data: {
          ownerId: request.user.sub,
        }
      })
    }

    await prisma.participant.create({
      data: {
        pollId: poll.id,
        userId: request.user.sub,
      }
    })

    return reply.status(201).send()
  })

  fastify.get('/polls', {
    onRequest: [authenticate]
  }, async (request) => {
    const polls = await prisma.poll.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub,
          }
        }
      },
      include: {
        _count: {
          select: {
            participants: true,
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return { polls }
  })

  fastify.get('/polls/:id', {
    onRequest: [authenticate]
  }, async (request) => {
    const getPoolParams = z.object({
      id: z.string(),
    })

    const { id } = getPoolParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            participants: true,
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return { poll }
  })
}
