import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"


// Listando todas as rotas de autenticação
export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/me', {
    onRequest: [authenticate]
  }, async (request) => {
    return { user: request.user };
  });

  // Rota d ecriação de usuários
  fastify.post('/users', async (request) => {
    const createUserBody = z.object({
      access_token: z.string(),
    })
    // Token de autenticação envidado pelo Google
    const { access_token } = createUserBody.parse(request.body)

    // Pegando as informações do usuário no google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    })

    const userData = await userResponse.json()

    // Validações do retorno de dados do google
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    })

    const userInfo = userInfoSchema.parse(userData)

    // Verifica se o usuário existe
    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        }
      })
    }

    const token =  fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl,
    }, {
      sub: user.id,
      expiresIn: '7 days'
    })

    return { token }
  })
}
