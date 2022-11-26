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
    // Valida o titulo do bolão
    const createPoolBody = z.object({
      title: z.string(),
    })

    // Pega o titulo do bolão
    const { title } = createPoolBody.parse(request.body);

    // Gera os 6 digitos do codigo
    const generate = new ShortUniqueId({ length: 6 })
    // Converte em maiusculo
    const code = String(generate()).toUpperCase()

    // Cria uma validação Jwt, se não estiver autenticado cria um unico bolão.
    // se estiver logado, criar o bolão e ja começa o bolão como participante
    try {
      await request.jwtVerify()

      // Inseri o novo Bolão com o Id do Usuário Logado
      await prisma.poll.create({
        data: {
          title,
          code,
          ownerId: request.user.sub, // Id Usuário Logado 

          // Delegando o Usuário Logodo como participante do Bolão rescem criado
          participants: {
            create: {
              userId: request.user.sub,
            }
          }
        }
      })
    } catch {
      // Cria um bolão sem Dono
      await prisma.poll.create({
        data: {
          title,
          code,
        }
      })
    }

    // Retornar o código do bolão recem criado
    return reply.status(201).send({ code })
  })

  // Rota para busca o Bolão pelo seu código
  fastify.post('/polls/join', {
    onRequest: [authenticate] // Verifica se esta autenticado
  }, async (request, reply) => {
    const joinPoolBody = z.object({
      code: z.string(), // Valida se foi informado o Código do Bolão
    })

    // Recebe o código do bolão
    const { code } = joinPoolBody.parse(request.body)

    // Pesquisa pelo bolão
    const poll = await prisma.poll.findUnique({
      where: {
        code,
      },
      // Verifica se o usuário logado ja participa do bolão
      include: {
        participants: {
          where: {
            userId: request.user.sub,
          }
        }
      }
    })

    // Se o boão não existir
    if (!poll) {
      return reply.status(400).send({
        message: 'Bolão não encontrado.'
      })
    }

    // Se o usuário ja estiver pariticando do bolão
    if (poll.participants.length > 0) {
      return reply.status(400).send({
        message: 'Você já esta no Bolão.'
      })
    }

    // Verifica se existe algum dono do bolão, se não tiver ser o primeiro participante logado
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

    // Cria um relacionamento do usuário logado com o bolão
    await prisma.participant.create({
      data: {
        pollId: poll.id,
        userId: request.user.sub,
      }
    })

    // Sucesso
    return reply.status(201).send()
  })

  // Lista os bolões do usuário logado, participa
  fastify.get('/polls', {
    onRequest: [authenticate] // verifica autenticação
  }, async (request) => {
    const polls = await prisma.poll.findMany({
      where: {
        participants: {
          some: { // verifica se o usuário logado pertenci ao bolão
            userId: request.user.sub, // Id do usuário logado
          }
        }
      },
      include: {
        _count: { // Quantidade de participante no bolão
          select: {
            participants: true,
          }
        },
        participants: { // Traz todos os participantes do bolão
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          take: 4, // Limita a qunatidade de avatares a serem mostrado
        },
        owner: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    // Retorna todos os Bolões
    return { polls }
  })

  // Detalhes de um determinado bolão
  fastify.get('/polls/:id', {
    onRequest: [authenticate] // Verifica a autenticação
  }, async (request) => {
    const getPoolParams = z.object({
      id: z.string(), // Código do Bolão para pesquisar
    })

    const { id } = getPoolParams.parse(request.params) // Id do Bolão

    // Pesquisa pelo bolão, pelo id
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

    // Retornar o Bolão selecionado
    return { poll }
  })
}