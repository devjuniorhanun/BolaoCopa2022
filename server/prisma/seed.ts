import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Método de criação de Seed
async function main() {
    // Seed de Usuario
    const user = await prisma.user.create({
        data: {
            name: 'SeuNome',
            email: 'seuemail@gmail.com',
            avatarUrl: 'https://github.com/seugit.png'
        }
    });

    // Seed de Bolões
    const poll = await prisma.poll.create({
        data: {
            title: 'Example Pool',
            code: 'BOL123',
            ownerId: user.id,

            participants: { // Incluindo um participante
                create: {
                    userId: user.id, // Id do Usuario cadastrado
                }
            }
        }
    });

    // Sedd de Jogo
    await prisma.game.create({
        data: {
            date: '2022-11-02T12:00:00.201Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    })

    // Criando um jogo e um palpite junto, com um participante
    await prisma.game.create({
        data: {
            date: '2022-11-03T12:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: { // Criando um Palpite
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: { // Incluindo um pariticipante ao jogo
                        connect: {
                            userId_pollId: {
                                userId: user.id,
                                pollId: poll.id,
                            }
                        }
                    }
                }
            }
        },
    })
}

main()