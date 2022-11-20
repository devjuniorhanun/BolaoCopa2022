import '@fastify/jwt'
// Arquivo de Definição do TypeScript
declare module '@fastify/jwt' {
  // Interface do Jwt
  interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      avatarUrl?: string;
    }
  }
}
