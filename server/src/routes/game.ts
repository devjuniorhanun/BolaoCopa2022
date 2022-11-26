import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

// Listando todas as rotas dos jogos
export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get('/pools/:id/games', {
    onRequest: [authenticate] // Verifica autenticação
  },async (request) => {
    // Vefirica se foi passado o Id do Bolão
    const getPoolParams = z.object({
      id: z.string(),
    })

    const { id } = getPoolParams.parse(request.params) // Id do Bolão

    // Lista os jogos do bolão
    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc', // Ordernação descendente
      },
      include: {
        guesses: {
          where: {
            participant: {
              userId: request.user.sub,
              poolId: id,
            }
          }
        }
      }
    })

    // Retorna os palpites de um determinado jogo
    return {
      games: games.map(game => {
        return {
          ...game,
          guess: game.guesses.length > 0 ? game.guesses[0] : null,
          guesses: undefined,
        }
      })
    }
  })
}
