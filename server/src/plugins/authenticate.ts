import { FastifyInstance, FastifyRequest } from "fastify";

// Plugin de Autenticação Jwt
export async function authenticate(request: FastifyRequest) {
  await request.jwtVerify()
}
