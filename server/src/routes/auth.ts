import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"


// Listando todas as rotas de autenticação
export async function authRoutes(fastify: FastifyInstance) {
  // Retorna o Usuário Logado
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

    // Informações do usuário
    const userData = await userResponse.json()

    // Validações do retorno de dados do google
    const userInfoSchema = z.object({
      id: z.string(), // id do google
      email: z.string().email(), // email
      name: z.string(), // nome
      picture: z.string().url(), // foto de perfil
    })

    // Validações
    const userInfo = userInfoSchema.parse(userData)

    // Verifica se o usuário existe
    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      }
    })

    // Se não existir o usuário ele criar um
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

    // Criação do Token do Jwt
    const token = fastify.jwt.sign({
      name: user.name, // Nome do Usuário
      avatarUrl: user.avatarUrl, // Avatar do Usuário
    }, {
      sub: user.id, // Usuário que criou o Token
      expiresIn: '7 days' // Tempo de Expiração
    })

    // Token gerado
    return { token }
  })
}
