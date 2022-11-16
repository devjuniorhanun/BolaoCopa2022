import Head from 'next/head'
import Image from 'next/image'
import { api } from "../lib/axios";

// Criando um interface HomeProps
interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

// Iniciando a aplicação Home
export default function Home(props: HomeProps) {
  return (
    <h1>Ola</h1>
  )
}

// Esportando as conexões com a api
export const getServerSideProps = async () => {
  const [
    pollCountResponse, // Traz a quantidade de bolões cadastrados
    guessCountResponse, // Traz a quantidade de Palpites cadastradas
    userCountResponse // Traz a quantidade de usuarios cadastrodos
  ] = await Promise.all([
    api.get('polls/count'), // rota de listagem de quantidade de bolões
    api.get('guesses/count'), // rota de listagem de quantidade de Palpites cadastradas
    api.get('users/count'), // rota de listagem de quantidade de usuarios cadastrodos
  ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
