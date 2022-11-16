import Fastify from 'fastify';
import cors from '@fastify/cors'
import jwt from "@fastify/jwt"
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';
import { guessRoutes } from './routes/guess';
import { userRoutes } from './routes/user';
import { pollRoutes } from './routes/poll';

// Método inicial 
async function bootstrap() {
    // Incianciando os logs do Fastity
    const fastify = Fastify({
        logger: true,
    })

    // Mecânismo de seguração
    await fastify.register(cors, {
        // Favor informar o dominio da aplicação em vez de true
        origin: true
    })

    // Em produção isso precisa ser uma viarável de ambiente

    await fastify.register(jwt, {
        secret: 'nlwcopa',
    })

    // Rotas iniciais
    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(pollRoutes)
    await fastify.register(userRoutes)


    // Instanciando o servidor, na porta 3333
    await fastify.listen({ port: 3333, /*host: '0.0.0.0'*/ })
}
// Instanciando a aplicação
bootstrap()