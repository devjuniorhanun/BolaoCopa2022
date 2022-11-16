import { PrismaClient } from "@prisma/client";

// Instanciando a conexão com o banco
// Lista todas as querys geradas pelo prisma
export const prisma = new PrismaClient({
    log: ['query'],
})