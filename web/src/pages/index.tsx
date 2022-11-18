import Image from 'next/image'

import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'


// Criando um interface HomeProps
interface HomeProps {
  // Força as variárias serem númericas
  pollCount: number;
  guessCount: number;
  userCount: number;
}

// Iniciando a aplicação Home
export default function Home(props: HomeProps) {
  // Cria um estado da propriedade do titulo do bolão
  const [pollTitle, setPoolTitle] = useState('')
  // Método de criação do bolão
  async function createPool(event:FormEvent){
    // Desabilita o refresh da página
    event.preventDefault()

    // Cria um conexão com a api
    try {
      const response = await api.post('polls',{
        title: pollTitle,
      });
      // Recebe o código gerado pela api
      const { code } = response.data

      // Copia o Código para a área de trabalho
      await navigator.clipboard.writeText(code)
      // Exibi uma mensagem de Sucesso
      alert('Bolão criado com Sucesso, o código ja foi copiado')
      // Reseta o formulário
      setPoolTitle('')
    } catch (err) {
      alert('Falha ao criar o Bolão')
    }

  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="Logo Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio Bolão da copa e Compartilhe entre seus Amigos!!!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <strong className='text-gray-100 text-xl'>
            <span className="text-ignite-500">+{props.userCount}</span> Pessoas já estão usando..
          </strong>
        </div>
        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder="Qual e o Nome do Bolão" 
            onChange={event => setPoolTitle(event.target.value)}
            value={pollTitle}
            />
          <button
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold  text-sm uppercase hover:bg-yellow-700'
            type="submit">
            Criar meu Bolão
          </button>
        </form>
        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá ser usados para convidar seus amigos 🚀...
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.pollCount}</span>
              <span>Bolões Criados</span>
            </div>
          </div>
          <div className='w-px h-14 bg-gray-600' />
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Participantes</span>
            </div>
          </div>

        </div>
      </main>

      <Image src={appPreviewImg} alt="Logo" />

    </div>
  )
}

// Iniciando as conexões com a api
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
      pollCount: pollCountResponse.data.count, // Mostra a quantidade de bolões
      guessCount: guessCountResponse.data.count, // Mostra a quantidade de palpites
      userCount: userCountResponse.data.count, // Mostra a quantidade de usuários
    }
  }
}
