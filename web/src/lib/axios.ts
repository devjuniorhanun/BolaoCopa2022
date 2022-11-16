import axios from 'axios';
// Criando um conexão com a api
export const api = axios.create({
  baseURL: 'http://localhost:3333', // Endereço do seu Servidor
});
